package servlets;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@WebServlet(name = "ConnectToLodchain", value = "/ConnectToLodchain")
public class ConnectToLodchain extends HttpServlet {

    //Antikatastiste to path me auto tou server sto mixanima pou trexei
    private static final String SAVE_DIRECTORY = "";
    private static int counter = 0;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException {

        try {
            //read request body
            InputStream inputStream = request.getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
            StringBuilder requestBody = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null)
                requestBody.append(line).append("\n");

            reader.close();

            //save triples in a file on the server
            BufferedWriter writer = new BufferedWriter(new FileWriter(SAVE_DIRECTORY +"\\triples_" + counter +".txt"));
            writer.write(requestBody.toString());
            writer.flush();
            writer.close();

            System.out.println(requestBody.toString());

            response.setStatus(200);
            response.getWriter().write("triples_" + counter++ +".txt");
        } catch (IOException e) {
            response.setStatus(500);
            e.printStackTrace();
        }
    }

}
