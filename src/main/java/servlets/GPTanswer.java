package servlets;

import GPT.ChatGPT;
import com.google.gson.JsonArray;
import org.codehaus.jettison.json.JSONArray;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;

@WebServlet(name = "GPTanswer", value = "/GPTanswer")
public class GPTanswer extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        ChatGPT chatgpt = new ChatGPT();
        String input = request.getParameter("question");
        String model = request.getParameter("gpt-model");
        double temperature = Double.parseDouble(request.getParameter("temperature"));

        HttpSession session = request.getSession();

        //Chat with history of past  conversation
        if(session.getAttribute("conv_type").toString().equals("continuous")){
            try {
                JsonArray jArr = (JsonArray) session.getAttribute("conv_history");
                jArr = chatgpt.getChatGPTResponse_continuous(input, temperature, jArr);
                session.setAttribute("conv_history", jArr); //Update session's chat history

                //get last response and return it to client
                String resp = jArr.get(jArr.size() - 1).getAsJsonObject().get("content").getAsString();

                response.setStatus(200);
                response.getWriter().write(resp);

            }  catch (Exception e) {
                e.printStackTrace();
                response.setStatus(500);
            }
        }
        //Chat without history (initial)
        else {
            try {
                String resp = chatgpt.getChatGPTResponse(input, model, temperature);
                response.setStatus(200);
                response.getWriter().write(resp);
            } catch (Exception e) {
                e.printStackTrace();
                response.setStatus(500);
            }
        }
    }

}
