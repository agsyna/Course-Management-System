import java.util.*;

class GroupProjectSystem {
    private static class Student {
        String name;
        int enrollmentNumber;
        int groupId;
        boolean hasSubmitted;
        Map<String, Map<String, Integer>> reviews; // Stores reviews given by this student

        Student(String name, int enrollmentNumber, int groupId) {
            this.name = name;
            this.enrollmentNumber = enrollmentNumber;
            this.groupId = groupId;
            this.hasSubmitted = false;
            this.reviews = new HashMap<>();
        }
    }

    private static class ProjectGroup {
        int groupId;
        List<Student> members;
        boolean isSubmitted;

        ProjectGroup(int groupId) {
            this.groupId = groupId;
            this.members = new ArrayList<>();
            this.isSubmitted = false;
        }

        void addMember(Student student) {
            members.add(student);
        }

        void submitProject(Student student) {
            if (!isSubmitted) {
                isSubmitted = true;
                for (Student member : members) {
                    member.hasSubmitted = true;
                }
                System.out.println("Project for Group " + groupId + " submitted by " + student.name + ". All members marked as submitted.");
            } else {
                System.out.println("Project already submitted.");
            }
        }

        void reviewMember(Student reviewer, String revieweeName, int contribution, int reachable, int helpful) {
            if (!isSubmitted) {
                System.out.println("Reviews cannot be given until the project is submitted.");
                return;
            }

            if (reviewer.name.equals(revieweeName)) {
                System.out.println("You cannot review yourself.");
                return;
            }

            Map<String, Integer> reviewScores = new HashMap<>();
            reviewScores.put("Contribution", contribution);
            reviewScores.put("Reachable", reachable);
            reviewScores.put("Helpful", helpful);

            reviewer.reviews.put(revieweeName, reviewScores);
            System.out.println( reviewer.name + " reviewed " + revieweeName);
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Map<Integer, ProjectGroup> groups = new HashMap<>();
        Set<Integer> enrollmentNumbers = new HashSet<>();

        System.out.println("Enter the number of groups:");
        int numGroups = scanner.nextInt();

        for (int i = 0; i < numGroups; i++) {
            System.out.println("\nEnter a unique Group ID:");
            int groupId;
            while (true) {
                groupId = scanner.nextInt();
                if (groups.containsKey(groupId)) {
                    System.out.println("Group ID already taken! Enter another one:");
                } else {
                    break;
                }
            }

            ProjectGroup group = new ProjectGroup(groupId);
            groups.put(groupId, group);

            System.out.println("Enter number of students in Group " + groupId + ":");
            int numStudents = scanner.nextInt();
            scanner.nextLine();

            for (int j = 0; j < numStudents; j++) {
                System.out.println("Enter Student Name:");
                String name = scanner.nextLine();

                System.out.println("Enter 6-digit Enrollment Number:");
                int enrollmentNumber;
                while (true) {
                    enrollmentNumber = scanner.nextInt();
                    if (enrollmentNumber < 100000 || enrollmentNumber > 999999) {
                        System.out.println("Invalid! Enrollment number must be 6 digits. Try again:");
                    } else if (enrollmentNumbers.contains(enrollmentNumber)) {
                        System.out.println("Enrollment number already exists in another group! Enter another one:");
                    } else {
                        enrollmentNumbers.add(enrollmentNumber);
                        break;
                    }
                }
                scanner.nextLine();

                Student student = new Student(name, enrollmentNumber, groupId);
                group.addMember(student);
            }
        }

        System.out.println("\nEnter Group ID to submit project:");
        int submitGroupId = scanner.nextInt();
        if (groups.containsKey(submitGroupId)) {
            ProjectGroup group = groups.get(submitGroupId);

            System.out.println("Enter Student Name who is submitting:");
            scanner.nextLine();
            String submitterName = scanner.nextLine();

            for (Student student : group.members) {
                if (student.name.equals(submitterName)) {
                    group.submitProject(student);
                    break;
                }
            }
        } else {
            System.out.println("Group not found!");
        }

        System.out.println("\nEnter Group ID for peer review:");
        int reviewGroupId = scanner.nextInt();
        if (groups.containsKey(reviewGroupId)) {
            ProjectGroup group = groups.get(reviewGroupId);

            if (!group.isSubmitted) {
                System.out.println("Project not submitted yet! Cannot start review.");
            } else {
                System.out.println("\nEnter Reviewer Name:");
                scanner.nextLine();
                String reviewerName = scanner.nextLine();
                Student reviewer = null;

                for (Student student : group.members) {
                    if (student.name.equals(reviewerName)) {
                        reviewer = student;
                        break;
                    }
                }

                if (reviewer == null) {
                    System.out.println("Reviewer not found in this group!");
                } else {
                    List<String> reviewableMembers = new ArrayList<>();
                    for (Student student : group.members) {
                        if (!student.name.equals(reviewer.name)) {
                            reviewableMembers.add(student.name);
                        }
                    }

                    while (!reviewableMembers.isEmpty()) {
                        System.out.println("\nAvailable members to review: " + reviewableMembers);
                        System.out.println(" Enter the name of the person to review:");
                        String revieweeName = scanner.nextLine();

                        if (reviewableMembers.contains(revieweeName)) {
                            System.out.println(" Enter scores (1-5) for:");
                            System.out.print("Contribution: ");
                            int contribution = scanner.nextInt();


                            System.out.print("Reachable: ");
                            int reachable = scanner.nextInt();
                            System.out.print("Helpful: ");
                            int helpful = scanner.nextInt();
                            scanner.nextLine(); // Consume newline

                            group.reviewMember(reviewer, revieweeName, contribution, reachable, helpful);
                            reviewableMembers.remove(revieweeName);
                        } else {
                            System.out.println("Invalid name! Try again.");
                        }
                    }
                }
            }
        } else {
            System.out.println("Group not found!");
        }

        scanner.close();
    }
}