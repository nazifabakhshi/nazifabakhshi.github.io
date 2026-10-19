package cs321.btree;

/**
 * Stores a fixed amount of data to facilitate quicker access
 * to it, maintaining order according to the most recently
 * accessed value and tossing the least recently accessed value
 * if the cache is full.
 * @author CS321 Instructors
 */

public interface CacheInterface<K, V extends KeyInterface<K>> {

    /**
     * Searches/reads the cache using a key.
     * If the key matches an object found in the cache, it hits and that
     * object is returned, then moved to the first position in the cache
     * (Most Recently Used [MRU] scheme).
     * If it's not found, the cache misses and null is returned.
     * @param key key of the object to be searched for
     * @return the value that matches the key if found, otherwise returns null
     */
    public V get(K key);

    /**
     * Adds an object to the first position of the cache.
     * Since the cache has a fixed size, if it's full the last entry
     * (least recently used) is removed before the new one is added.
     * @param value value to add to the cache
     * @return removed object (if necessary)
     */
    public V add(V value);

    /**
     * Locate the object by key and remove it if it exists.
     * @param key key of the object to remove
     * @return removed object, or null if not found
     */
    public V remove(K key);

    /**
     * Clears everything in the cache.
     */
    public void clear();

    /**
     * {@inheritDoc} 
     * The toString for the cache outputs a string containing 
     * statistics about the cache: the maximum size of the cache; 
     * the number of references; number of hits; the hit ratio 
     * (as a percentage to two decimal points).  
     * See below for an example of the toString output:
        <br>
        <br>~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        <br>Cache with 10 entries has been created
        <br>~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        <br>Total number of references:        100
        <br>Total number of cache hits:        74
        <br>Cache hit percent:                 74.00%

     */
    public String toString();
}
