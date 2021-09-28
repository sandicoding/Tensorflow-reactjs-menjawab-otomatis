import React, { useRef, useEffect, useState } from "react"
import "./App.css"

// 0. Install Dependencies
// 1. Import dependencies
import * as tf from "@tensorflow/tfjs"
import * as qna from "@tensorflow-models/qna"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from "react-loader-spinner"
import { Fragment } from "react"

function App() {
    // 2. Setup References and state hooks
    const passageRef = useRef(null)
    const questionRef = useRef(null)
    const [answer, setAnswer] = useState()
    const [model, setModel] = useState(null)

    // 3. Load Tensorflow Model
    const loadModel = async () => {
        const loadedModel = await qna.load()
        setModel(loadedModel)
        console.log("Model Loaded")
    }

    useEffect(() => {
        loadModel()
    }, [])
    // 4. Handle Questions

    const answerQuestion = async (e) => {
        if (e.which === 13 && model !== null) {
            console.log("Question Submitted.")
            const passage = passageRef.current.value
            const question = questionRef.current.value

            const answers = await model.findAnswers(question, passage)
            setAnswer(answers)
            console.log(answers)
        }
    }
    return (
        <div className="App">
            <header className="App-header">
                {model == null ? (
                    <div>
                        <div>Model Loading</div>
                        <Loader type="Puff" color="@00BFFF" height={100} width={100} />
                    </div>
                ) : (
                    <Fragment>
                        Passage
                        <textarea ref={passageRef} rows="30" cols="100"></textarea>
                        Ask a Question
                        <input ref={questionRef} onKeyPress={answerQuestion} size="80" />
                        Answers
                        {answer
                            ? answer.map((ans, index) => (
                                  <div>
                                      <b>Answer {index + 1}</b>
                                      {ans.text} ({Math.floor(ans.score * 100) / 100})
                                  </div>
                              ))
                            : " "}
                    </Fragment>
                )}
            </header>
        </div>
    )
}

export default App
