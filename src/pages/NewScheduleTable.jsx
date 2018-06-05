import React, { Component } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Footer from '../components/Footer';
import Popup from "reactjs-popup";
import "../css/ScheduleTable.css";
import {Table,ButtonToolbar,ToggleButtonGroup,ToggleButton} from 'react-bootstrap';
import "../css/popup.css";
import "../css/bootstrap.min.css";
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import Calendar from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";


Calendar.setLocalizer(Calendar.momentLocalizer(moment));
var test;
var ds = new Date(Date.UTC(2018,4,1,7));
console.log(ds);
var de = new Date(Date.UTC(2018,4,1,13));
export default class NewScheduleTable extends Component {
    constructor(props){
      super(props);
      this.state={
        doctor_events_list: [],
        all_events: [],
        all_doctors: [],
        all_category : [
          "Geral"
        ],
        category : '',
      };
    }

    async componentDidMount() {
        try {
          const name = 'http://localhost:8000/doctor/api-doctor/';
          const res = await fetch(name);
          console.log(res);
          const all_doctors = await res.json();
          console.log(all_doctors);
          this.setState({all_doctors});
        } catch (e) {
          console.log(e);
        }
        await this.createCategoryList();
        await this.componentDidMount1();

      }

      createCategoryList() {
        var category;
        this.state.all_doctors.map(each => (
          category = this.categoryValidate(each.category),
          this.pushCategoryValid(category)

        ));

        this.setState({
             all_doctors: this.state.all_doctors,
        });
        console.log(this.state.all_doctors);
      }

    async componentDidMount1() {
        try {
          this.setState({all_doctors:""})
          const name = 'http://localhost:8000/doctor/api-doctor/list-doctor/category/?category='+this.state.category;
          const res = await fetch(name);
          console.log(res);
          const all_doctors = await res.json();
          console.log(all_doctors);
          this.setState({all_doctors});
        } catch (e) {
          console.log(e);
        }
        await this.componentDidMount2();

      }

      async componentDidMount2() {
          try {
            const name = 'http://localhost:8000/schedule/api-event/';
            const res = await fetch(name);
            console.log(res);
            const all_events = await res.json();
            this.setState({all_events});
          } catch (e) {
            console.log(e);
          }
          await this.createEventDoctorList();
      }

      parseISOLocal(s) {
        var b = s.split(/\D/);
        return new Date(b[0], b[1]-1, b[2], b[3], b[4], b[5]);
      }

      createEventDoctorList(){
        var title,start,end;
        this.setState({
          doctor_events_list : [],
        })
        this.state.all_events.map(each => (
          title = this.getDoctorId(each.doctor),
          start = this.parseISOLocal(each.start),
          end = this.parseISOLocal(each.end),
          this.pushEventValid(title,start,end)
        ));

        this.setState({
             doctor_events_list: this.state.doctor_events_list,
        });
        console.log(this.state.all_doctors);
        console.log(this.state.all_events);
        console.log(this.state.doctor_events_list);
      }

      pushEventValid(title,start,end){
        if (title !== "") {
          this.state.doctor_events_list.push({'start':start,'end':end,'title':title})
        }
      }

      getDoctorId(id){
        var name = "";
        this.state.all_doctors.map(each =>(
           name = this.compareId(each.id,id,each.name, name)
        ));
        return name;
      }

      pushCategoryValid(category){
        if(category !== ""){
          this.state.all_category.push(category);
        }
      }

      categoryValidate(category){
        var aux = "";
        this.state.all_category.map(each =>(
           aux = this.compareCategory(each,aux,category)
        ));
        return aux;
      }

      compareCategory(categoryOfList,invalid,category){
        if(category === categoryOfList){
          var aux =  invalid;
        }
        else {
          var aux = category;
        }
        return aux;
      }

      compareId(id,id2,doctorName,realName){
        if(id === id2){
          var name = doctorName;
        }
        else{
          var name = realName;
        }
        return name;
      }

      changeTable(tableNumber){
        this.setState({
          all_events: [],
        })
        if (tableNumber === 0) {
          this.setState({
          category : "",
          })
        }
        else {
          this.setState({
          category : this.state.all_category[tableNumber],
          })
        }

        this.componentDidMount1()

    }


    render(){
        let toolBar = []
        for(let count=0; count<this.state.all_category.length; count++){
          toolBar.push(
             <ToggleButton className="btn btn-outline-primary" value={count} onClick={()=>this.changeTable(count)}>{this.state.all_category[count]}</ToggleButton>
           )
        }
    	return (
    	  <div>
    	    <NavBar></NavBar>
          <SideBar></SideBar>
            <div  className="container">
                <div style={{marginTop:"70px",marginBottom:"100px"}} className="jumbotron">
                    <div className="App">
                      <header className="App-header">

                        <ButtonToolbar>
                            <ToggleButtonGroup type="radio" name="options" defaultValue={0}>
                              {toolBar}
                            </ToggleButtonGroup>
                        </ButtonToolbar>
                        <h1 >Quadro de Horários</h1>
                      </header>
                      <Calendar
                        views={['month', 'week', 'day']}
                        defaultDate={new Date()}
                        defaultView="month"
                        events={this.state.doctor_events_list}
                        style={{ height: "100vh" }}
                      />
                    </div>
                </div>
            </div>
            <Footer></Footer>
    	    </div>
    	);
    }
 }
