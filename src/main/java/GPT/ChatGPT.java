package GPT;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;


import com.google.gson.JsonArray;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;
import com.google.gson.JsonObject;



/**
 *
 * @author mountant
 */
public class ChatGPT {

    public String key = "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";

    /**Calls gpt without caring  about conversation history*/
    public String getChatGPTResponse(String text, String model, double temperature) throws Exception{
        if(model.equals("davinci")){
            return chatGPT(text, temperature);
        }
        else if(model.equals("turbo")){
            return chatGPT_TURBO(text, temperature);
        }

        return "";
    }

    /**Calls gpt turbo version without caring  about conversation history*/
    public  String chatGPT_TURBO(String text, double temperature) throws Exception {
        String url = "https://api.openai.com/v1/chat/completions";
        HttpURLConnection con = (HttpURLConnection) new URL(url).openConnection();

        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setRequestProperty("Authorization", "Bearer "+key);


        JSONObject data = new JSONObject();
        data.put("model", "gpt-3.5-turbo");
        data.put("messages", "[{'role': 'user', 'content': 'MyText'}]");
        data.put("temperature", temperature);
        data.put("max_tokens", 2000);

        String body=data.toString().replace("\"[", "[").replace("]\"", "]").replace("'","\"").replace("MyText", text);
        System.out.println(body);
        con.setDoOutput(true);
        con.getOutputStream().write(body.toString().getBytes());

        int responseCode = con.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) {

            String output = new BufferedReader(new InputStreamReader(con.getInputStream())).lines()
                    .reduce((a, b) -> a + b).get();
            System.out.println(output);
            return new JSONObject(output).getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content");
        }
        else {   //possible token exceedance

            System.out.println("Error: " + responseCode);
            InputStream errorStream = con.getErrorStream();
            if (errorStream != null) {
                String errorOutput = new BufferedReader(new InputStreamReader(errorStream)).lines()
                        .reduce((a, b) -> a + b).orElse("");
                System.out.println("Error details: " + errorOutput);
            }
        }
        return null;
    }

    /**Calls gpt davinci version without caring  about conversation history*/
    public  String chatGPT(String text, double temperature) throws Exception {
        String url = "https://api.openai.com/v1/completions";
        HttpURLConnection con = (HttpURLConnection) new URL(url).openConnection();

        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setRequestProperty("Authorization", "Bearer "+key);


        JSONObject data = new JSONObject();
        data.put("model", "text-davinci-003");
        data.put("prompt", text);
        data.put("max_tokens", 1000);
        System.out.println(text);

        data.put("temperature", temperature);

        con.setDoOutput(true);
        con.getOutputStream().write(data.toString().getBytes());

        int responseCode = con.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) {

            String output = new BufferedReader(new InputStreamReader(con.getInputStream())).lines()
                    .reduce((a, b) -> a + b).get();
            System.out.println(output);

            return new JSONObject(output).getJSONArray("choices").getJSONObject(0).getString("text");
        }
        else { //possible token exceedance

            System.out.println("Error: " + responseCode);
            InputStream errorStream = con.getErrorStream();
            if (errorStream != null) {
                String errorOutput = new BufferedReader(new InputStreamReader(errorStream)).lines()
                        .reduce((a, b) -> a + b).orElse("");
                System.out.println("Error details: " + errorOutput);
            }
        }
        return null;
    }

    /**
     * @author Koumis
     *
     * Calls gpt by providing past conversation history
     */
    public JsonArray getChatGPTResponse_continuous(String text, double temperature, JsonArray jArr) throws Exception{
        String url = "https://api.openai.com/v1/chat/completions";
        HttpURLConnection con = (HttpURLConnection) new URL(url).openConnection();

        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setRequestProperty("Authorization", "Bearer "+key);

        //Prepare current question
        JsonObject curr_question = new JsonObject();
        curr_question.addProperty("role","user");
        curr_question.addProperty("content",text);

        //append to prevous QnA
        jArr.add(curr_question);
        System.out.println(jArr.toString());

        //call
        JsonObject  data = new JsonObject();
        data.addProperty("model", "gpt-3.5-turbo-16k");
        data.addProperty("messages", jArr.toString());
        data.addProperty("temperature", temperature);
        data.addProperty("max_tokens", 4000);

        String body=data.toString().replace("\\", "").replace("\"[", "[").replace("]\"", "]");
        System.out.println(body);
        con.setDoOutput(true);
        con.getOutputStream().write(body.toString().getBytes());

        String output = new BufferedReader(new InputStreamReader(con.getInputStream())).lines()
                .reduce((a, b) -> a + b).get();

        //Append response
        JsonObject response_data = new JsonObject();
        response_data.addProperty("role", "assistant");
        response_data.addProperty("content", new JSONObject(output).getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content"));
        jArr.add(response_data);
        System.out.println("UPDATED SESSION ARR :" + jArr.toString());
        System.out.println("response details :" + output);

        return jArr;
    }

}