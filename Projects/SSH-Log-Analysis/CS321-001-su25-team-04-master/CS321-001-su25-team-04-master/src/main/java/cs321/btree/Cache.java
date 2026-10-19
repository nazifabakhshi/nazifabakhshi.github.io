package cs321.btree;

import java.text.DecimalFormat;
import java.util.LinkedList;
import java.util.ListIterator;

/**
 * Stores a fixed amount of data to facilitate quicker access
 * to it, maintaining order according to the most recently
 * accessed value and tossing the least recently accessed value
 * if the cache is full.
 * @param <K>
 * @param <V>
 */
public class Cache<K, V extends KeyInterface<K>> 
				    implements CacheInterface<K, V> {
    private LinkedList<V> cache;
    private final int MAX_SIZE; // Maximum size of the cache
    private int referencesCount; // Amount of times get() was called
    private int hitsCount; // Amount of times get() successfully found an item in the cache
    
    /**
     * Creates a new empy cache with the given max size
     * @param size
     */
    public Cache(int size) {
        MAX_SIZE = size;
        cache = new LinkedList<>();
        referencesCount = 0;
        hitsCount = 0;
    }

    public V get(K key) {
        V returnVal = null;
        ListIterator<V> it = cache.listIterator();
        while (it.hasNext() && (returnVal == null)) {
            V currVal = it.next();
            // Check if the keys match on this object
            if (currVal.getKey().equals(key)) {
                // Hit, remove the key and put it at the start of the cache
                it.remove();
                cache.addFirst(currVal);
                // Also update the hit count
                hitsCount++;
                returnVal = currVal;
            }
        }
        referencesCount++;
        return returnVal;
    }

    public V add(V value) {
        V returnVal = null;
        // Check if the cache is full before adding
        if (cache.size() == MAX_SIZE) {
            // It's full, remove the last element and return it
            returnVal = cache.removeLast();
        }
        cache.addFirst(value);
        return returnVal;
    }

    public V remove(K key) {
        ListIterator<V> it = cache.listIterator();
        V returnVal = null;
        while (it.hasNext() && (returnVal == null)) {
            V currVal = it.next();
            // Compare keys to look for a match
            if (currVal.getKey().equals(key)) {
                // They match, remove the object
                it.remove();
                returnVal = currVal;
            }
        }
        return returnVal;
    }

    public void clear() {
        cache.clear();
    }

    public String toString() {
        // Append all of the lines to string builder
        StringBuilder str = new StringBuilder();
        str.append("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        str.append("\nCache with " + MAX_SIZE + " entries has been created");
        str.append("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        str.append("\nTotal number of references: " + referencesCount);
        str.append("\nTotal number of cache hits: " + hitsCount);
        // Get the hit percentage + format it to two decimal points
        DecimalFormat format = new DecimalFormat("0.00");
        double percentage = ((double)hitsCount/referencesCount * 100);
        str.append("\nCache hit percent: " + format.format(percentage) + "%");
        // Return all this as a string
        return str.toString();
    }
}
