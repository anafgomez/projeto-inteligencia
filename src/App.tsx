import { useState } from "react"
import { ItemSuggestion } from "./components/itemSuggestion"
import { getHistoric, setHistoric } from "./storage/historic"
import { sendMessage } from "./api/openai"

type ProgressType = 'pending' | 'started' | 'done'

type Message = {
  role: 'user' | 'assistant'
  content: string
  subject?: string
}


function App() {
  const [progress, setProgress] = useState<ProgressType>('pending')
  const [textarea, setTextArea] = useState<string>('')
  const [chat, setChat] = useState<Message[]>([])

  const resetChat = () => {
    setProgress('pending')
    setChat([])
  }

  async function handleSubmitChatMessage() {
    if (!textarea) {
      return
    }

    const message = textarea
    setTextArea('')

    if (progress === 'pending') {
      setHistoric(message)

      const prompt = `gere uma receita`

      const messageGPT: Message = {
        role: 'user',
        content: prompt,
        subject: message
      }

      setChat(text => [...text, messageGPT])

      const questionGPT = await sendMessage([messageGPT])

      setChat(text => [...text, {role: 'assistant', content: questionGPT.content}])

      setProgress('started')
      return
    }


    const responseUser: Message = {
      role: 'user',
      content: message
    }

    const feedbackGPT = await sendMessage([...chat, responseUser])

    setChat(text => [...text, responseUser])

    setChat(text => [...text, { role: 'assistant', content: feedbackGPT.content}])

    setProgress('done')
  }

  return (
    <div className="container">
      <div className="sidebar">
        <details open className="suggestion">
          <summary>Tópiccos Sugeridos</summary>
          <ItemSuggestion  title="HTML" onClick={() => setTextArea('HTML')}/>
          <ItemSuggestion  title="CSS" onClick={() => setTextArea('CSS')}/>
          <ItemSuggestion  title="JavaScript" onClick={() => setTextArea('JavaScript')}/>
          <ItemSuggestion  title="TypeScript" onClick={() => setTextArea('TypeScript')}/>
        </details>

        <details open className="historic">
          <summary>Histórico</summary>
          {
            getHistoric().map((item, index) => (
              <ItemSuggestion 
                key={index}  
                title={item} 
                onClick={() => setTextArea(item)}
              />
            ))
          }
        </details>
      </div>
      <div className="content">
        {progress === 'pending' && (
            <div className="box-home">
              <span>Olá, eu sou a</span>
              <h1>Inteligenc<span>.ia</span></h1>
              <p>Estou aqui para te ajudar nos seus estudos.
                Selecione um dos tópicos sugeridos ao lado ou digite um tópico que deseja estudar para começarmos
              </p>
            </div>
          )}
          
        {progress !== 'pending' && (
          <div className="box-chat">
            {chat[0] && (
              <h1>Você está estudando sobre <span>{chat[0].subject}</span></h1>
            )}

            {chat[1] && (
              <div className="question">
                <h2><img src={"/src/assets/question.png"} alt="Question icon"/>Pergunta</h2>
                <p>{chat[1].content}</p>
              </div>
            )}

            {chat[2] && (
              <div className="answer">
                <h2>Sua resposta</h2>
                <p>{chat[2].content}</p>
              </div>
            )}

            {chat[3] && (
              <div className="feedback">
                <h2>Feedback Inteligenc<span>.ia</span></h2>
                <p>{chat[3].content}</p>
                <div className="actions">
                  <button onClick={resetChat}>Escrever novo tópico</button>
                </div>
              </div>
            )}


          </div>
        )}

        {progress !== 'done' && (
          <div className="box-input">
            <textarea
              value={textarea}
              onChange={element => setTextArea(element.target.value)}
              placeholder={
                progress === 'started' ? "Insira sua resposta" : "Insira o tema que deseja estudar"
              }
            />
            <button onClick={handleSubmitChatMessage}>
              {progress === 'pending' ? 'Enviar pergunta' : "Enviar resposta"}
            </button>
          </div>
        )}


        <footer>
          <p>Inteligenc<span>.ia</span></p>
        </footer>
      </div>
    </div>
  )
}

export default App
