// food for thoughts
// We have some repetitive code here
// We can actually use an array to store some infor
// and make the code cleaner and scalable
// ideas?

// This is to only run our script when the browser has finished loading the page
$(() => {

  // Which of the following is an official stroke order rule for writing Chinese characters?
  // A. Write curves before straight lines
  // B. Start from the bottom and write upward
  // C. Horizontal strokes before vertical strokes (Correct)
  // D. Write dots last in every characterX

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

    // Clear previous generation and prepare for streaming
    $("#generation").html("").addClass("generation-loading");
    
    sendPromptToOpenAI(
        numQuestions,
        gradeLevel,
        purpose,
        assessmentExample
    );
  });

  // This is to listen to Reset btn click
  $("#reset").click(() => {
    console.log("reset");
    $("#gradeLevel").val("");
    $("#numQuestions").val("");
    $("#purpose").val("");
    $("#assessmentExample").val("");
    $("#generation").html("Waiting for assessment to be generated").removeClass("generation-loading");
  });

  // Here is how we send a prompt to OpenAI and receive a streaming response
  const sendPromptToOpenAI = async (numQuestions, gradeLevel, purpose, assessmentExample) => {
    const promptTemplate = `
    Imagine three different teachers are creating an ${numQuestions}-question assessment for ${gradeLevel} that will ${purpose}. 
    
    Each teacher will discuss their thinking about creating the assessment based on validity, reliability, authenticity, and fairness. They will collaboratively choose the best version based on the discussion. Include the thinking in your output. Then the teachers will go on to the next section, etc

    Now output the thoughts and assessment based on the assessment example below
    ---
    ${assessmentExample}
    `
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: promptTemplate,
            },
          ],
          temperature: 0.7,
          stream: true, // Enable streaming
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = ''; // Accumulate all content for markdown rendering

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          $("#spinner").remove();
          $("#generation").removeClass("generation-loading");
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.trim() === '') continue;
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              $("#spinner").remove();
              $("#generation").removeClass("generation-loading");
              return;
            }
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                // Accumulate content and render as markdown
                fullContent += content;
                const renderedMarkdown = marked.parse(fullContent);
                $("#generation").html(renderedMarkdown);
              }
            } catch (e) {
              console.error('Error parsing streaming response:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in streaming request:', error);
      $("#spinner").remove();
      $("#generation").removeClass("generation-loading");
      $("#generation").html("<p class='text-danger'>An error occurred while generating the assessment. Please try again.</p>");
    }
  };
});
