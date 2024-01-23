package servlets;

import GPT.ChatGPT;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;


/**For the second call to chat-GPT when requesting the RDF N-triples
 * (no history straight up call to GPT)
 */
@WebServlet(name = "GPTanswerFacts", value = "/GPTanswerFacts")
public class GPTanswerFacts extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ChatGPT chatgpt = new ChatGPT();
        String input = request.getParameter("question");
        String model = request.getParameter("gpt-model");

        if(model == null)               //manually set model when using plain-text since user doesn't choose in the beginning
            model = "turbo";          //set it to davinci for speed purposed on developing. Will change later anyway

        try {
            String resp = chatgpt.getChatGPTResponse(input, model, 0.1); //0.1 for full accuracy
            response.setStatus(200);
            response.getWriter().write(resp);
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
            response.getWriter().write("Max tokens exceeded!");
        }

    }

}
