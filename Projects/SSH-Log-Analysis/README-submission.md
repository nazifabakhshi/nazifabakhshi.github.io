### The Cool Group
## Team Members

| Last Name | First Name | GitHub User Name |
|-----------|------------|------------------|
| Radkiewicz       | Summer        | summerradkiewicz/maluridae-radio (woops)              |
| Bakhshi       | Nazifa       |   nazifabakhshi           |       |
| Nye       | Tyra        | TyraNye        

# Test Results
How many of the dumpfiles matched (using the check-dump-files.sh script)?
    All of them match (9)

How many of the btree query files results matched (using the check-btree-search.sh script)?
    All of them match (18)

How many of the database query files results matched (using the check-db-search.sh script)?
    All of them match (9)


# AWS Notes
It has taken me a few hours to be able to both ssh into an AWS instance and
clone the git repo both times I've done it. The SSH keys and access is something
I mess up every time and have to generate a new key for to get anywhere. When actually in
the instance it's easy to navigate, so I guess my experience inside it is 
perfectly fine if you ignore the getting there part (Summer).

# Reflection

## AI Usage
#### Summer
I primarily worked on BTree.java and the classes that it relies on. Near the end of developing it
I was stuck on an issue for a few days that I knew was related to an indexing error in one of the parts
of the insertion function, but couldn't place exactly what. I decided to have AI pinpoint the issue and
that made where I went wrong a lot clearer. 
When SSHCreateBTree.java was mostly complete by Tyra, I also used AI to help with inserting the SSH log data
into the btree. Reading through it made me realize that this whole time I've completely overlooked the 
existence of the btree interface, and re-wrote some of the AI-generated methods that should have belonged in
the BTree instead. 

#### Nazifa
I mostly followed the Data Wrangler instructions and used the information and links provided in the project. I also used AI to explain some concepts that were new to me, help with Git commands, and understand errors while I was running and checking my work. I did not always use the solutions suggested by AI because sometimes fixing one part based on an AI suggestion caused another part of my code to break. Because of this, I mainly used AI for explanation, guidance, and correcting code mistakes, then tested and verified the changes myself before keeping them.

#### Tyra
I used AI primarily as a coding assistant to help draft boilerplate logic for parsing command-line arguments in SSHCreateBTreeArguments and setting up structure for the test cases in SSHCreateBTreeTest. When building SSHCreateBTree and SSHSearchDatabase, I also leaned on AI to double-check my query logic and ensure proper handling of edge cases when interacting with our B-tree and database structures. It was particularly helpful for accelerating repetitive setup tasks, though I carefully reviewed and adjusted the generated code to make sure it fit seamlessly with our team's shared interfaces and project constraints. It also helped when some parts were not working on my end that the AI help explain why its not working and what could be the problem.


## Reflection (Team member name: Summer)
This project mostly taught me about programming with a group, hopefully I did a good enough job but I
think my crippling fear of procrastinating has led me to be too overbearing on my teammates.
With all the previous projects, I'm starting to accept the fact that I'm pretty much always going to
feel lost writing the code until it's nearly done. 
Other than that, I think I've almost accepted that feeling kind of lost when going into a project is 
going to be the norm. And feeling kind of lost throughout at least half of development until you realize
that you did most of it wrong. 
I want to say that I'm also learning how to better use AI when writing code? Once I understood the overall
flow of the program it was nice to use it to troubleshoot really specific bugs that I got caught up on.

## Reflection (Team member name: Nazifa)
I really enjoyed working with my teammates on this project. I liked how everyone was responsible for their part of the project and how we helped each other when we had problems with the code. It was also easy to communicate with my team and ask for help when I needed it. One of the challenging parts for me was working with different classes and fixing errors when different parts of the project depended on each other. I overcame this by communicating with my teammates, testing my work, and asking questions when I was unsure. Overall, this project helped me learn more about teamwork, debugging, and working on a larger Java project.

## Reflection (Team member name: Tyra)
Working on this project gave me a much stronger grasp of how to build out structured data pipelines, command-line argument handlers, and search scripts within a larger Java application. One of the main challenges I faced was coordinating integration points—such as ensuring that SSHCreateBTree and SSHSearchDatabase interacted cleanly with the B-tree and database components developed by the rest of the team. I overcame these challenges by writing dedicated unit tests in SSHCreateBTreeTest, systematically breaking down errors during testing, and communicating closely with my teammates to keep our class interactions aligned. Overall, this project was a great exercise in modular design, robust testing, and collaborative development. I also had problems sending files to my team but I found it using the command line and it was getting sent to somewhere else. At the end it was fixed


