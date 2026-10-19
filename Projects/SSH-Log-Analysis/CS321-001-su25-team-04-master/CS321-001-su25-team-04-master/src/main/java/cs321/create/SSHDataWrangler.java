package cs321.create;

import cs321.common.ParseArgumentException;
import java.io.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


/**
 * The driver class for wrangling a raw SSH log file into a useful form.
 *
 * @author Nazifa Bakhshi
 */
public class SSHDataWrangler {
    // variables
	private static String rawSSHFile ; // input: raw file
	private static String SSHFile ;// output: my new log txt

    /**
     * Main driver of program.
     * @param args
     */
    public static void main(String[] args) throws Exception
	{
        parseArguments(args);  //get the input and output file
        wrangleFile(); // read clean
		System.out.println("The new ssh_log.txt created!");
	}


    /**
     * Process command line arguments.
     * this method will to make clear for the program which one in input to read and which one is output
     * @param args  The command line arguments passed to the main method.
     */
    public static void parseArguments(String[] args) throws ParseArgumentException
    {
        if(args.length !=2) {
            printUsageAndExit("Please provide two files.");
        }
        rawSSHFile= args[0]; // first file is input
        SSHFile = args[1]; // second file is output

    }

    /**
     * wanglefile will process the file
     *
     */
    // publishing
    private static void wrangleFile() throws IOException{
        String baseLine ,cleandLine;
        try (

          BufferedReader readerFile = new BufferedReader(new FileReader(rawSSHFile)); //  we need to  create a reader to open and read the input file
          BufferedWriter writerFile = new BufferedWriter(new FileWriter(SSHFile)); // we need to  create a reader to open and read the input file

      ) {

          while ((baseLine = readerFile.readLine()) != null) {  //read  one line until no line remain
              cleandLine = cleanLine(baseLine);
          if(cleandLine != null) {
              writerFile.write(cleandLine);
              writerFile.newLine();
          }
      }
     } catch (IOException e) {
          throw new RuntimeException(e);}
    }

    /**
     *
     * cleanLine  method, it will find the time, data and IP address and etc.. also
     * it will check if any of raw miss the date or time and ignore them.
     */
    //This method is part of cleaning process

    private static String cleanLine(String baseLine) {

        String date, time, ipAddress, userName, hostName;
        date = getDate(baseLine);
        time = getTime(baseLine);

        if (date == null || time == null) {
            return null;
        }
        ipAddress = findIpAddress(baseLine);
        if (ipAddress == null) {
            return null;
        }

        if (baseLine.contains("Accepted")) {
            userName = findUserName(baseLine, "Accepted");
            if (userName != null) {
                userName = userName.replaceFirst("^user", "");
            }
            return buildLine(date, time, "Accepted", userName, ipAddress);
        }

        if (baseLine.contains("Invalid user")) {
            userName = getNextWord(baseLine, "Invalid user"); //  find  the root
            if (userName != null) {
                userName = userName.replaceFirst("^user", "");
            }
            return buildLine(date, time, "Invalid", userName, ipAddress);
        }

        if (baseLine.contains("Failed") && !baseLine.contains("message repeated")) {
            userName = findUserName(baseLine, "Failed");
            if (userName != null) {
                userName = userName.replaceFirst("^user", "");
            }
            return buildLine(date, time, "Failed", userName, ipAddress);
        }

   // TODO: need to check if this also needs the "user" prefix strip
        if (baseLine.contains("reverse mapping")) {
            hostName = getNextWord(baseLine, "getaddrinfo for");
            return buildLine(date, time, "reverse", hostName, ipAddress);
        }

        if (baseLine.contains("Address")) {
            hostName = getNextWord(baseLine, "maps to");
            if (hostName == null) {
                return null;
            }
            hostName = hostName.replace(",", "");
            return buildLine(date, time, "Address", ipAddress, hostName);
        }
        return null;
    }

    /**
     * this method will find the month and day by checking the beginning of each line then it will change to the number.
     * @param baseLine
     * @return
     */
    //Structuring
     private static String getDate(String baseLine) {
         String  month, day;
         Pattern datePattern = Pattern.compile( "^(\\w{3})\\s+(\\d{1,2})");
         Matcher dateMatch = datePattern.matcher(baseLine); //

         if(!dateMatch.find()) { // if the pattern wan not found return nothing
             return null;
         }
         month = dateMatch.group(1);
         day = dateMatch.group(2);

         return monthToNumber(month) + "/" + Integer.parseInt(day); // change month to number
     }

     private static String getTime (String baseLine) {
         Pattern timePattern = Pattern.compile( "\\d{2}:\\d{2}:\\d{2}");
         Matcher timeMatch = timePattern.matcher(baseLine);

         if(timeMatch.find()) {
             return timeMatch.group();
         }
         return null; // if no time found
     }

     private static String findIpAddress(String baseLine) {
         Pattern ipPattern = Pattern.compile( "\\d{1,3}(\\.\\d{1,3}){3}");
         Matcher ipMatch = ipPattern.matcher(baseLine);
         String foundIp = null;
         if (baseLine.contains("reverse mapping")) {
             while (ipMatch.find()) {
                 foundIp = ipMatch.group();
             }
             return foundIp;
         }
         if(ipMatch.find()) {
             return ipMatch.group(); // return the complete ip address
         }
        return null;
     }


     private  static String findUserName(String baseLine, String type) {
         Pattern userPattern = Pattern.compile(type + "\\s+\\S+\\s+for\\s+" + "(?:invalid\\s+user\\s+)?" + "(\\S+)");
         Matcher userMatch = userPattern.matcher(baseLine);

         if(userMatch.find()) {
            return userMatch.group(1);
         }
        return null;

     }

    private static String getNextWord(String baseline, String text) {
        Pattern nextWordpattern = Pattern.compile(Pattern.quote(text) + "\\s+(\\S+)");
        Matcher nextWordmatcher = nextWordpattern.matcher(baseline);

        if (nextWordmatcher.find()) {
            return nextWordmatcher.group(1);
        }
        return null;

    }

    /**
     * this method will create a clean line after that all info found.
     * @param date
     * @param time
     * @param type
     * @param value
     * @param ipAddress
     * @return
     */

    private static String buildLine(String date, String time, String type, String value, String ipAddress) {
        if (value == null) {
            return null;
        }
        return date + " " + time + " " + type + " " + value + " " + ipAddress;
    }

    /**
     *Helper method to convert a month name to a number.
     * @param month in letters
     * @return month in a number
     */

    private static String monthToNumber(String month) {

        switch (month.toLowerCase()) {
            case "jan":
                return "1"; // January becomes 1.

            case "feb":
                return "2";

            case "mar":
                return "3";

            case "apr":
                return "4";

            case "may":
                return "5";

            case "jun":
                return "6";

            case "jul":
                return "7";

            case "aug":
                return "8";

            case "sep":
                return "9";

            case "oct":
                return "10";

            case "nov":
                return "11";

            case "dec":
                return "12";

            default:
                return null;
        }
    }

	/**
	 * Print usage message and exit.
	 * @param errorMessage the error message for proper usage
	 */
	private static void printUsageAndExit(String errorMessage)
    {
        System.err.println(errorMessage);
        System.err.println( "Please enter the raw SSH file first, then the output file.");

        System.exit(1); //stop
	}

}
