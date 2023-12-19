# How to run

To employ this project on your local machine, you need to import it as a Maven project and deploy it on a local server (such as Tomcat) in WAR exploded format .

>[!NOTE] 
>When developing I used a proxy to enable cross-origin requests to LODsydesis API. If you wish to hande CORS in any other way you need to remove the 'proxyURL' constant from my code in LODsyndesis.js at line 235.
>If you decide to handle CORS like I did, then you need to go on this website https://cors-anywhere.herokuapp.com/corsdemo and request temporary access, before running the project
