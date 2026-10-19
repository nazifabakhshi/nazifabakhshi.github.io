package cs321.btree;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.Arrays;
import java.util.List;

/**
 * A BTree that arranges BTreeNodes according to
 * a specific degree, stores TreeObjects as keys
 */
public class BTree implements BTreeInterface{
    private final int DISK_BLOCK_SIZE = 4096;
    private final int METADATA_SIZE = Long.BYTES + Integer.BYTES;
    private long rootAddress = METADATA_SIZE;

    private FileChannel file;
	private ByteBuffer buffer;
    private int degree = (DISK_BLOCK_SIZE - (1 + Integer.BYTES) + TreeObject.BYTES) / (2 * (Integer.BYTES + TreeObject.BYTES));

    private Cache<Long, BTreeNode> cache; // store frequently visited nodes here
    // key is the disk address

    private final int NODE_BYTES; // how many bytes are allocated for a node when saved to disk
    private final int CHILD_POINTER_SIZE = Long.BYTES; // byte length of a reference to another node's location
    private BTreeNode root;
    private int nodeCount;
    private int currIndex = 0; // this is used to keep track of nodes while traversing them in-order

    /**
     * A node of the BTree, has a max/min amount of keys/children
     */
    private class BTreeNode implements KeyInterface<Long> {
        private int numKeys;
        private TreeObject[] keys; // max = 2t - 1 keys, min = t - 1 (note: min values don't apply to root)
        private boolean isLeaf;
        private BTreeNode[] children; // max = 2t, min = t
        private long[] childReferences;
        private long address; // where this node's info starts in the file

        /**
         * Creates a new BTreeNode with no keys and an empty array
         * for the children and keys
         */
        public BTreeNode() {
            numKeys = 0;
            keys = new TreeObject[(degree * 2) - 1];
            children = new BTreeNode[degree * 2];
            childReferences = new long[degree * 2];
            address = (nodeCount * NODE_BYTES) + METADATA_SIZE;
            nodeCount++;
            isLeaf = true;
        }

        /**
         * Checks if the max amount of keys have been reached in this node
         * @return
         */
        public boolean isFull() {
            return numKeys == (degree * 2) - 1;
        }

        /**
         * Sets the "is leaf" property of this node (is a leaf if it has no children)
         */
        public void setLeaf(boolean isLeaf) {
            this.isLeaf = isLeaf;
        }

        /**
         * Inserts a key into the key array and increments the key count,
         * assumes the index to insert at is empty
         * @param key
         * @param index
         */
        public void insertKey(TreeObject key, int index) {
            keys[index] = key;
            numKeys++;
        }

        @Override
        public String toString() {
            String str = "[" + keys[0].getKey().toString();
            for (int i = 0; i < keys.length; i++) {
                str += ", " + keys[i].getKey().toString();
            }
            str += "]";
            return str;
        }

        /**
         * Gets the child by index based on if the child exists in memory
         * or just as an address for the file location
         * @param index
         * @return
         */
        public BTreeNode getChild(int index) {
            if (children[index] != null) {
                return children[index];
            // } else if (childReferences[index] > 0) {
            //     children[index] = diskRead(childReferences[index]);
            //     return children[index];
            } else if (childReferences[index] > 0) {
                return diskRead(childReferences[index]);
            } else {
                return null;
            }
        }

        /**
         * Sets both this node's child and childReference array at the index
         */
        public void setChild(BTreeNode node, int index) {
            children[index] = node;
            childReferences[index] = node.address;
        }   

        public Long getKey() {
            return address;
        }
    }

    /**
     * Creates a new BTree from an input file
     * @param filename
     */
    public BTree(String filename) {
        this(0, filename, 100);
    }

    /**
     * Creates a new BTree from an input file and with the specified degree
     * (uses optimal degree if less than 2)
     * @param filename
     */
    public BTree(int inputDegree, String filename) {
        this(inputDegree, filename, 100);
    }

    /**
     * Creates a new tree from an input file with
     * the given degree (finds optimal degree if less than 2)
     * and saves nodes to a cache with the given size
     * @param degree
     * @param filename
     */
    public BTree(int inputDegree, String filename, int cacheSize) {
        if (inputDegree >= 2) {
            this.degree = inputDegree; 
        }
        NODE_BYTES = (CHILD_POINTER_SIZE * (degree * 2)) + (TreeObject.BYTES * ((2 * degree) - 1)) + 1 + Integer.BYTES;
        //reasoning:    (children reference size * max children) + (key size * max keys) + leaf boolean + numKeys

        cache = new Cache<>(cacheSize);

        File fileSrc = new File(filename);
        buffer = ByteBuffer.allocateDirect(NODE_BYTES); // this reads the file in chunks that match the node size
        try {
            // If the file doesn't exist yet, create a new one and write the metadata
            if (!fileSrc.exists()) {
                fileSrc.createNewFile();
                RandomAccessFile dataFile = new RandomAccessFile(fileSrc, "rw");
                file = dataFile.getChannel();
                root = new BTreeNode();
                root.address = rootAddress = METADATA_SIZE;
                writeMetadata(); 
            } else {
                RandomAccessFile dataFile = new RandomAccessFile(fileSrc, "rw");
                file = dataFile.getChannel();
                readMetadata();
                root = diskRead(rootAddress);
            }
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }

    /**
     * Inserts the key into the BTree
     * @param key
     */
    public void insert(TreeObject key) {
        if (root.isFull()) {
            splitRoot();
        }
        insertNonFull(root, key);
    }

    /**
     * Splits the root node/children to make room for keys
     * @return
     */
    private BTreeNode splitRoot() {
        BTreeNode newRoot = new BTreeNode();
        newRoot.setLeaf(false);
        newRoot.setChild(root, 0);
        root = newRoot;
        rootAddress = root.address;
        splitChild(newRoot, 0);
        return newRoot;
    }

    /**
     * Splits the children of this node at the index
     * @param node
     * @param index
     */
    private void splitChild(BTreeNode node, int index) {
        BTreeNode fullNode = node.getChild(index); // split this guy
        BTreeNode rightNode = new BTreeNode(); // takes the greater half of the split node
        rightNode.isLeaf = fullNode.isLeaf;
        rightNode.numKeys = degree - 1; // half of the keys of a full node (minus the one we extracted/raised)
        for (int i = 0; i < degree - 1; i++) {
            rightNode.keys[i] = fullNode.keys[i + degree];
        }
        if (!fullNode.isLeaf) { // if the full node wasn't a leaf, copy the children too
            for (int i = 0; i < degree; i++) {
                rightNode.setChild(fullNode.getChild(i + degree), i);
            }
        }
        fullNode.numKeys = degree - 1;
        for (int i = node.numKeys; i >= index + 1; i--) { // shift the parent node's children to the right
            node.setChild(node.getChild(i), i + 1);
        }
        node.setChild(rightNode, index + 1); // make room for the right node as a child
        for (int i = node.numKeys - 1; i >= index; i--) { // shift keys in the original node
            node.keys[i + 1] = node.keys[i];
        }
        node.insertKey(fullNode.keys[degree - 1], index);
        diskWrite(fullNode);
        diskWrite(rightNode);
        diskWrite(node);
    }

    private boolean splitChildCheckDuplicate(BTreeNode node, int index, TreeObject key) {
        // check for duplicates first
        BTreeNode child = node.getChild(index);
        for (int i = 0; i < child.numKeys; i++) {
            if (key.compareTo(child.keys[i]) == 0) {
                child.keys[i].incCount();
                diskWrite(child);
                return true;
            }
        }
        splitChild(node, index);
        return false;
    }

    /**
     * Inserts a key into a node that isn't full
     * @param node
     * @param key
     */
    private void insertNonFull(BTreeNode node, TreeObject key) {
        int i;
        boolean duplicate = false;
        if (node.isLeaf) {
            // shift keys in the node to make room for the new key
            for (i = node.numKeys - 1; (i >= 0) && (key.compareTo(node.keys[i]) <= 0); i--) {
                if (key.compareTo(node.keys[i]) == 0) {
                    node.keys[i].incCount();
                    duplicate = true;
                    // undo all the shifting if a duplicate was found
                    for (int j = i + 1; j < node.numKeys; j++) {
                        node.keys[j] = node.keys[j + 1];
                    }
                    break;
                } else {
                    node.keys[i + 1] = node.keys[i];
                }
            }
            if (!duplicate) {
                node.insertKey(key, i + 1);
            }
            diskWrite(node);
        } else {
            // find which child the key belongs to
            for (i = node.numKeys - 1; i >= 0 && (key.compareTo(node.keys[i]) <= 0); i--) {
                if (key.compareTo(node.keys[i]) == 0) {
                    node.keys[i].incCount();
                    diskWrite(node);
                    duplicate = true;
                    break;
                }
            }
            i++;
            if (!duplicate) {
                if (node.getChild(i).isFull()) { // Split the Child
                    duplicate = splitChildCheckDuplicate(node, i, key);
                    if (!duplicate) {
                        if (key.compareTo(node.keys[i]) > 0) { // figure out if the key goes to the left/right child
                            i++;
                        }
                    }
                }
                if (!duplicate) {
                    insertNonFull(node.getChild(i), key);
                }
            }
        }
    }

    /**
     * Reads a node from the disk as a BTreeNode,
     * or accesses it from a cache if it's there
     * @param diskLocation where to start reading the node in
     * @return
     */
    public BTreeNode diskRead(long diskLocation) {
        if (diskLocation == 0) {
            return null;
        }
        // see if we can find the node in the cache first
        BTreeNode cacheNode = cache.get(diskLocation);
        if (cacheNode != null) {
            return cacheNode;
        }
        // didn't find it; now actually read from disk
        try {
            file.position(diskLocation);
            buffer.clear();

            // read in a whole node from the disk to the buffer
            file.read(buffer);
            buffer.flip();

            // get the node info in the order that we stored it
            int numKeys = buffer.getInt();
            boolean leaf = (buffer.get() == 1); // gets the next byte, which is the "is leaf" bool
            BTreeNode readNode = new BTreeNode();
            readNode.isLeaf = leaf;
            readNode.address = diskLocation;

            // read in each key, add it to the node
            for (int i = 0; i < numKeys; i++) {
                // get the 64 bytes that represent the key (String)
                String key;
                byte[] stringBytes = new byte[64];
                buffer.get(stringBytes);

                // trim off trailing 0's
                int len = 0;
                while (len < stringBytes.length && stringBytes[len] != 0) {
                    len++;
                }
                key = new String(stringBytes, 0, len, StandardCharsets.UTF_8);

                // get the long that represents the frequency
                long frequency = buffer.getLong();

                // insert this key into our node
                readNode.insertKey(new TreeObject(key, frequency), i);
            }

            // skip past any null keys to start of child pointers
            for (int i = 0; i < ((degree * 2) - 1) - numKeys; i++) {
                byte[] emptyKey = new byte[TreeObject.BYTES];
                buffer.get(emptyKey);
            }

            // read in each child reference (not the actual child)
            for (int i = 0; i < numKeys + 1; i++) {
                long addr = buffer.getLong();
                readNode.childReferences[i] = addr;
            }

            cache.add(readNode);
            return readNode;
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
        return null;
    }

    /**
     * Write this node's information to disk
     * @param node
     */
    public void diskWrite(BTreeNode node) {
        try {
            file.position(node.address);
		    buffer.clear();

            // write node metadata
            buffer.putInt(node.numKeys);
            if (node.children[0] != null || node.childReferences[0] > 0) {
                node.isLeaf = false;
            }
            if (node.isLeaf) {
                buffer.put((byte) 1);
            } else {
                buffer.put((byte) 0);
            }

            // write keys
            for (int i = 0; i < ((2 * degree) - 1); i++) {
                TreeObject obj = node.keys[i];
                if (obj != null) {
                    // turn the String key into a byte array
                    byte[] keyByteArray = obj.getKey().getBytes(StandardCharsets.UTF_8);
                    byte[] shortenedKeyArray = Arrays.copyOf(keyByteArray, 64); 
                    buffer.put(shortenedKeyArray);
                    buffer.putLong(obj.getCount());
                } else {
                    // no key, but we still need to use this space
                    byte[] nullArray = new byte[TreeObject.BYTES];
                    buffer.put(nullArray);
                }
            }

            // write children
            for (int i = 0; i < (2 * degree); i++) {
                long childAddress = node.childReferences[i];
                if (childAddress > 0) {
                    buffer.putLong(childAddress);
                } else {
                    byte[] nullArray = new byte[Long.BYTES];
                    buffer.put(nullArray);
                }
            }

            buffer.flip();
		    file.write(buffer);
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }

    /**
     * Writes the metadata to the disk
     * (root node address + the number of nodes in the tree)
     */
    private void writeMetadata() {
        try {
            file.position(0);

            ByteBuffer tmpbuffer = ByteBuffer.allocateDirect(METADATA_SIZE);

            tmpbuffer.putLong(rootAddress);
            tmpbuffer.putInt(nodeCount);

            tmpbuffer.flip();
            file.write(tmpbuffer);
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }

    /**
     * Reads the metadata from the disk and sets the address of the root node
     */
    private void readMetadata() {
        try {
            file.position(0);
            ByteBuffer tmpbuffer = ByteBuffer.allocateDirect(METADATA_SIZE);

            tmpbuffer.clear();
            file.read(tmpbuffer);

            tmpbuffer.flip();
            rootAddress = tmpbuffer.getLong();
            nodeCount = tmpbuffer.getInt();
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }

    /**
     * Writes the root node to disk
     * and closes the file channel
     */
    public void finish() {
        diskWrite(root);
        writeMetadata();
        try {
            file.close();
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }

    /**
     * Searches the whole BTree for the key, returns
     * corresponding TreeObject if found
     * @param key
     * @return
     */
    public TreeObject search(String key) {
        TreeObject target = new TreeObject(key);
        Object[] result = searchRecursive(root, target);
        if (result != null) {
            BTreeNode parent = (BTreeNode) result[0];
            int index = (int) result[1];
            return parent.keys[index];
        }
        return null;
    }

    /**
     * Searches the BTree for the specified key starting at this node
     * @param node
     * @param key
     * @return returns an object[] which contains the node and index of the key in that node
     */
    public Object[] searchRecursive(BTreeNode node, TreeObject key) {
        int index = 0;
        while (index < node.numKeys && (key.compareTo(node.keys[index]) > 0)) {
            index++;
        }
        if (index < node.numKeys && (key.compareTo(node.keys[index]) == 0)) {
            return new Object[]{node, index};
        } else if (node.isLeaf) {
            return null;
        } else {
            return searchRecursive(node.getChild(index), key);
        }
    }

    // public TreeObject search(BTreeNode node, TreeObject key) {
    //     int index = 0;
    //     while (index < node.numKeys && (key.compareTo(node.keys[index]) > 0)) {
    //         index++;
    //     }
    //     if (index < node.numKeys && (key.compareTo(node.keys[index]) == 0)) {
    //         return node.keys[index];
    //     } else if (node.isLeaf) {
    //         return null;
    //     } else {
    //         return search(node.getChild(index), key);
    //     }
    // }

    /**
     * Returns an ordered string array of every key in the BTree (up to the int limit)
     * @return
     */
    public String[] getSortedKeyArray() {
        String[] keyArray = new String[(int) getSize()]; 
                        // note, this only works right if size is within the int limit
        currIndex = 0;
        getSortedArrayTraversal(root, keyArray);
        return keyArray;
    }

    /**
     * Fills the provided String[] with all keys from the BTree
     * @param node
     * @param output
     */
    private void getSortedArrayTraversal(BTreeNode node, String[] output) {
        int i = 0;
        while (currIndex < output.length) {
            if (!node.isLeaf) {
                getSortedArrayTraversal(node.getChild(i), output);
            }
            if (i >= node.numKeys) {
                return;
            }
            if (node.keys[i] != null) {
                output[currIndex] = node.keys[i].getKey();
            }
            currIndex++;
            i++;
        }
    }

    /**
     * Get the degree of this BTree
     * @return
     */
    public int getDegree() {
        return degree;
    }

    /**
     * Get the total amount of unique keys in this BTree
     * @return
     */
    public long getSize() {
        return sizeTraversal(root);
    }

    private int sizeTraversal(BTreeNode node) {
        int sum = 0;
        if (node != null) {
            sum = node.numKeys;
            for (int i = 0; i < node.numKeys + 1; i++) {
                sum += sizeTraversal(node.getChild(i));
            }
        }
        return sum;
    }

    /**
     * Get the height of this BTree (how many nodes high)
     * @return
     */
    public int getHeight() {
        return heightTraversal(root);
    }

    /**
     * Assuming the tree is balanced, navigate from 
     * the root to the leftmost leaf node and return
     * that as the height
     * @param node
     * @return
     */
    private int heightTraversal(BTreeNode node) {
        if (root.numKeys == 0) {
            return 0;
        }
        if (!node.isLeaf) {
            return 1 + heightTraversal(node.getChild(0));
        } else {
            return 0;
        }
    }

    /**
     * Get the amount of nodes in this BTree
     * @return
     */
    public long getNumberOfNodes() {
        return nodeCount;
    }

    @Override
    public void dumpToFile(PrintWriter out) throws IOException {
        dumpToFileRecursive(out, root);
    }

    private void dumpToFileRecursive(PrintWriter out, BTreeNode node) throws IOException {
        if (node == null) {
            return;
        }
        for (int i = 0; i < node.numKeys; i++) {
            TreeObject key = node.keys[i];
            out.println(key.getKey() + " " + key.getCount());
            dumpToFileRecursive(out, node.getChild(i));
        }
        dumpToFileRecursive(out, node.getChild(node.numKeys)); // get last child if it exists
    }

    @Override
    public void dumpToDatabase(String dbName, String tableName) throws IOException {
        String url = "jdbc:sqlite:" + dbName;

        try (Connection conn = DriverManager.getConnection(url)) {
            if (conn != null) {
                try (Statement stmt = conn.createStatement()) {
                    // Create table for this specific tree type
                    stmt.execute("CREATE TABLE IF NOT EXISTS " + tableName + " (key TEXT, frequency INTEGER)");
                    stmt.execute("DELETE FROM " + tableName); // Clear old records if re-running
                }

                String insertSql = "INSERT INTO " + tableName + " (key, frequency) VALUES (?, ?)";

                // Insert every key/frequency pair from the inorder traversal
                conn.setAutoCommit(false);
                try (PreparedStatement pstmt = conn.prepareStatement(insertSql)) {
                    SQLInsertRecursive(pstmt, root);
                }
                conn.commit();
            }
        } catch (Exception e) {
            System.err.println("Database error during BTree storage: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void SQLInsertRecursive(PreparedStatement p, BTreeNode node) throws Exception {
        if (node == null) {
            return;
        }
        for (int i = 0; i < node.numKeys; i++) {
            TreeObject key = node.keys[i];
            p.setString(1, key.getKey());
            p.setLong(2, key.getCount());
            p.executeUpdate();
            SQLInsertRecursive(p, node.getChild(i));
        }
        SQLInsertRecursive(p, node.getChild(node.numKeys));
    }

    @Override
    public void delete(String key) {
        // trust me this method is definitely not broken
        Object[] result = searchRecursive(root, new TreeObject(key));
        if (result != null) {
            BTreeNode parent = (BTreeNode) result[0];
            int index = (int) result[1];
            parent.keys[index] = null;
            // shift down keys after the removed one
            for (int i = index; i < parent.numKeys; i++) {
                parent.keys[i] = parent.keys[i + 1];
            }
            // if there are children between this key or if this is the only key,
            // everything breaks and explodes
            parent.numKeys--;
        }
    }
}
