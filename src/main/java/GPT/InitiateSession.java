package GPT;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import org.codehaus.jettison.json.*;
import com.google.gson.*;

@WebServlet(name = "InitiateSession", value = "/InitiateSession")
public class InitiateSession extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String conv_type = request.getParameter("conv_type");

        HttpSession session = request.getSession();
        session.setAttribute("conv_type", conv_type);   //bind user's choice to this session

        JsonArray jArr = new JsonArray();
        session.setAttribute("conv_history",jArr);

        response.setStatus(200);
    }
}
