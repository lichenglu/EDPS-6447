// food for thoughts
// We have some repetitive code here
// We can actually use an array to store some infor
// and make the code cleaner and scalable
// ideas?

// This is to only run our script when the browser has finished loading the page
$(() => {

  // This is to listen to Submit btn click
  $("#submit").click(() => {
    const gradeLevel = $("#gradeLevel").val();
    const numQuestions = $("#numQuestions").val();
    const purpose = $("#purpose").val();
    const assessmentExample = $("#assessmentExample").val();
    console.log(gradeLevel, numQuestions, purpose, assessmentExample);

    $("#spinner").remove();
    $("body").append(`
        <div style="position: absolute; top: calc(50% - 16px); left: calc(50% - 16px)" id="spinner">
            <div class="spinner-grow" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `);

    sendPromptToOpenAI(
        numQuestions,
        gradeLevel,
        purpose,
        assessmentExample
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        $("#generation").text(data.choices[0].message.content);
        $("#spinner").remove();
      });
  });

  // This is to listen to Reset btn click
  $("#reset").click(() => {
    console.log("reset");
    $("#gradeLevel").val("");
    $("#numQuestions").val("");
    $("#purpose").val("");
    $("#assessmentExample").val("");
  });

  // Here is how we send a prompt to OpenAI and receive a response
  const sendPromptToOpenAI = (numQuestions, gradeLevel, purpose, assessmentExample) => {
    const promptTemplate = `
    Imagine three different teachers are creating an ${numQuestions}-question assessment for ${gradeLevel} that will ${purpose}. 
    
    Each teacher will discuss their thinking about creating the assessment based on validity, reliability, authenticity, and fairness. They will collaboratively choose the best version based on the discussion. Include the thinking in your output. Then the teachers will go on to the next section, etc

    Now output the thoughts and assessment based on the assessment example below
    ---
    ${assessmentExample}
    `
    return fetch('https://api.openai.com/v1/chat/completions', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: promptTemplate,
          },
        ],
        temperature: 0.7,
      }),
    });
  };
});
