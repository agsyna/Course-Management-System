import java.util.*;
public class AssignmentDeadline {

    static HashMap<String, ArrayList<String>> calendar = new HashMap<>();

    public static void main(String[] args) {


        Scanner sc = new Scanner(System.in);

        while(true)
        {
            System.out.println("CHOOSE 1 TO ADD DEADLINE, CHOOSE 2 TO SHOW CALENDAR");
            int n = sc.nextInt();
            if(n==1)
            {
                System.out.println("Input assignment deadline along with name");
                String deadline = sc.next();
                String name = sc.nextLine();
                addDeadline(deadline, name);
            }
            if(n==2)
            {
                System.out.println();
             showCalendar();   
            }
            else{
                System.out.println("INVALID INPUT");
            }
        }

    }

    static int checkDate(String deadline)
    {
        return calendar.getOrDefault(deadline, new ArrayList<>()).size();
    }

    static void addDeadline(String deadline, String name)
    {

            int availability = checkDate(deadline);
            if (availability == 0) 
            {
                calendar.put(deadline, new ArrayList<>());
                calendar.get(deadline).add(name);

                System.out.println("Assignment added successfully !");

            }
            else if (availability == 1) 
            {
                calendar.get(deadline).add(name);

                System.out.println("Assignment added successfully !");

            } 
            else {  
                System.out.println("Choose another deadline. \n This deadline is already full.");
            }
    }


    static void showCalendar() {
        
        System.out.println("Assignment Schedule:");
        if (calendar.isEmpty()) {

            System.out.println("No assignments scheduled");


        }
        for (Map.Entry<String, ArrayList<String>> entry : calendar.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}