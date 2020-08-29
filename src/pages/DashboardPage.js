import React from 'react';
import Calendar from 'react-calendar';
import { Row, Col } from 'react-bootstrap';
import { Header, Container } from 'rsuite';
import Speech from '../components/SpeechRecognition'
import Carousel from '../components/Carousel'
import TodoApp from '../components/TodoApp'
import SideBar from '../components/SideBar'
import DarkModeToggle from '../components/DarkModeToggle'
import "../App.css";
import { createTheme } from 'react-dark-theme'

const white = "#FFFFFF";
const black = "#272b34";
const gray_black = "#272b34";
// const gray_black2 = "#393c47";
const gray = "#F8F8F9";
const dark_black = "#202229";

const lightTheme = {
    background: white,
    text: black,
    secondary: gray,
    third: black,
}

const darkTheme = {
    background: gray_black,
    text: white,
    secondary: dark_black,
    third: dark_black,
}

var todoItems = [];
todoItems.push({ index: 1, value: "learn react", done: false });
todoItems.push({ index: 2, value: "Go shopping", done: true });
todoItems.push({ index: 3, value: "buy flowers", done: true });


class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      date: new Date(),
      priority: '',
      task: '',
      display: "hide",
    }
  }

  componentDidMount() {
    window.addEventListener('load', this.handleLoad);
  }

  handleLoad = e => {
    // e.preventDefault();
    this.setState( {'user': window.location.search.split('=')[1]})

    // get user data from database and append to the DOM

  }

  // handle click on the calendar to set date
  onChange = date => this.setState({ date })

  handleChange = e => {
    this.setState({ [e.currentTarget.name]: e.target.value})
  }


  // send username and new task info to /add in server
  handleNewTask = e => {
    e.preventDefault();

    fetch("/add", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth': window.localStorage.token,
      },
      body: JSON.stringify({
        'user': this.state.user,
        'date': this.state.date,
        'priority': this.state.priority,
        'task': this.state.task,
      })
    })
    .then( res => {
      console.log(res.status);
    })
    .catch( err => {console.error(err) })

    // remove all inputs from the add task area
    this.setState({
      date: new Date(),
      priority: '',
      task: '',
      display: 'hide',
    })
  }


  render() {
    let myTheme = createTheme(darkTheme, lightTheme);
    return (
      <div className="show-fake-browser sidebar-page h-100">
        <Container className="h-100" style={{ backgroundColor: myTheme.background, color: myTheme.text }}>
          <SideBar backgroundColor={myTheme.secondary} color={myTheme.text} />
          <Container>
            <Header>
              {/* <h2>Page Title</h2> */}
            </Header>

            <Row>
              <Col sm={9}>
                  {/* Speech Recognition to add tasks */}
                  <div>
                    <div id="task-container">
                      <div id="taskInfo">
                        <label for="date" className="label">Due date</label>
                        <input
                          type="text"
                          name="date"
                          value={this.state.date}
                          onChange={this.handleChange}></input>
                        <label for="priority" className="label">Priority (from most to least important)</label>
                        <select name="priority" value={this.state.priority} onChange={this.handleChange}>
                          <option value=''>---Select---</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                        </select>
                        <label for="task" class="label">Task</label>
                        <textarea
                          name="task"
                          class="task content"
                          rows="4" cols="50"
                          value={this.state.task}
                          onChange={this.handleChange}></textarea>
                      </div>

                      {/* <div className={`voice-container ${this.state.display}`}>
                        <div>
                          <label for="textbox" className="label">Voice content</label>
                          <textarea id="voice content" rows="4" cols="50">
                          
                          </textarea>
                        </div>
                        <button class="button start" type="submit" onClick={this.toggleListen}>Start</button>
                        <button class="button stop" type="submit" >Stop</button>
                        <button class="button load" type="submit">Load</button>
                      </div> */}

                    {/* <button class="button voice" type="submit" onClick={() => this.handleVoice()}>Voice Recognition</button> */}
                    <Speech/>
                    <button class="button submit" type="submit" onClick={this.handleNewTask} >Submit</button>
                    </div>

                    
                  </div>

                  {/* Tasks Containers */}

                  
                  {/* <Carousel /> */}

                  

              </Col>


              <Col sm={3}>
                  <DarkModeToggle lightTheme={lightTheme} darkTheme={darkTheme} />

                  {/* Calendar */}
                  <div id="calendar" className="p-0">
                      <Calendar
                          value={this.state.date}
                          onChange={this.onChange}
                      />
                  </div>

                  {/* Priority tasks */}
                  <TodoApp initItems={todoItems} />
              </Col>
            </Row>
          </Container>
        </Container>
      </div >
    );
  }
}

export default DashboardPage;
