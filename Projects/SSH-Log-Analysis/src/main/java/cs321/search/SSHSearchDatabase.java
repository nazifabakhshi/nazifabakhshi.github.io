package cs321.search;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * The driver class for searching a Database of a B-Tree.
 * @author Tyra Nye
 */
public class SSHSearchDatabase
{
    private static final String[][] TEST_DATA = {
        {"Accepted-111.222.107.90", "25"},
        {"Accepted-112.96.173.55", "3"},
        {"Accepted-112.96.33.40", "3"},
        {"Accepted-113.116.236.34", "6"},
        {"Accepted-113.118.187.34", "2"},
        {"Accepted-113.99.127.215", "2"},
        {"Accepted-119.137.60.156", "1"},
        {"Accepted-119.137.62.123", "9"},
        {"Accepted-119.137.62.142", "1"},
        {"Accepted-119.137.63.195", "14"},
        {"Accepted-123.255.103.142", "5"},
        {"Accepted-123.255.103.215", "5"},
        {"Accepted-137.189.204.138", "1"},
        {"Accepted-137.189.204.155", "1"},
        {"Accepted-137.189.204.220", "1"},
        {"Accepted-137.189.204.236", "1"},
        {"Accepted-137.189.204.246", "1"},
        {"Accepted-137.189.204.253", "3"},
        {"Accepted-137.189.205.44", "2"},
        {"Accepted-137.189.206.152", "1"},
        {"Accepted-137.189.206.243", "1"},
        {"Accepted-137.189.207.18", "1"},
        {"Accepted-137.189.207.28", "1"},
        {"Accepted-137.189.240.159", "1"},
        {"Accepted-137.189.241.19", "2"}
    };

    public static void main(String[] args) throws Exception
    {
        String type = null;
        String database = null;
        int topFrequency = 10; // default or specified

        // Parse command line arguments
        for (int i = 0; i < args.length; i++) {
            if (args[i].startsWith("--type=")) {
                type = args[i].substring("--type=".length());
            } else if (args[i].startsWith("--database=")) {
                database = args[i].substring("--database=".length());
            } else if (args[i].startsWith("--top-frequency=")) {
                try {
                    topFrequency = Integer.parseInt(args[i].substring("--top-frequency=".length()));
                } catch (NumberFormatException e) {
                    // Ignore or handle
                }
            }
        }

        if (database == null) {
            System.err.println("Error: Database parameter is required.");
            System.exit(1);
        }

        String jdbcUrl = "jdbc:sqlite:" + database;

        if ("test".equals(type)) {
            // Create test database and table, then insert test data
            try (Connection conn = DriverManager.getConnection(jdbcUrl);
                 Statement stmt = conn.createStatement()) {
                
                // Drop table if it exists and create 'acceptedip'
                stmt.execute("DROP TABLE IF EXISTS acceptedip;");
                stmt.execute("CREATE TABLE acceptedip (key TEXT, frequency INTEGER);");

                // Insert the 25 test entries
                String insertSql = "INSERT INTO acceptedip (key, frequency) VALUES (?, ?);";
                try (PreparedStatement pstmt = conn.prepareStatement(insertSql)) {
                    for (String[] entry : TEST_DATA) {
                        pstmt.setString(1, entry[0]);
                        pstmt.setInt(2, Integer.parseInt(entry[1]));
                        pstmt.executeUpdate();
                    }
                }
            } catch (SQLException e) {
                System.err.println("Database error during test setup: " + e.getMessage());
                System.exit(1);
            }
        } else if (type != null) {
            // Normal search operation against the specified database table
            // Note: SQL syntax rules state table names should not contain hyphens (e.g., accepted-ip -> acceptedip)
            String tableName = type.replace("-", "");

            try (Connection conn = DriverManager.getConnection(jdbcUrl);
                 PreparedStatement pstmt = conn.prepareStatement(
                     "SELECT key, frequency FROM " + tableName + " ORDER BY frequency DESC LIMIT ?;")) {
                
                pstmt.setInt(1, topFrequency);
                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        String key = rs.getString("key");
                        int frequency = rs.getInt("frequency");
                        System.out.println(key + " " + frequency);
                    }
                }
            } catch (SQLException e) {
                System.err.println("Database error during search: " + e.getMessage());
                System.exit(1);
            }
        } else {
            System.err.println("Error: --type option is required.");
            System.exit(1);
        }
    }
}