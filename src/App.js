import React from 'react'; 
import Todo from './Todo';
import AppTodo from './AppTodo';
import { Paper, List, Container, Grid, Button, AppBar, Toolbar, Typography} from '@material-ui/core';
import './App.css';
import { call, signout } from './services/ApiService';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items :[],
      loading:true,
    };
  }

  add = (item) => {
    call("/todo", "POST", item).then((response) => this.setState({items:response.data}))
  }
  
  delete = (item) => {
    call("/todo", "DELETE", item).then((response) => this.setState({items:response.data}))
  }

  update = (item) => {
    call("/todo", "PUT", item).then((response) => this.setState({items:response.data}))
  }

  componentDidMount() {
    call("/todo", "GET", null).then((response) => this.setState({items:response.data}))
  }

  render(){
    var todoItems = this.state.items.length > 0 && (
      <Paper style={{margin:16}}>
        <List>
          {this.state.items.map((item, idx) => (
            <Todo item={item} key={item.id} delete = {this.delete} update = {this.update}/>
          ))}
        </List>
      </Paper>
    );

    var navigationBar = (
      <AppBar position='static' style={{ backgroundColor: '#556677' }}>
          <Toolbar>
              <Grid justifyContent="space-between" container>
                  <Grid item>
                      <Typography variant='h6'> 오늘의 할 일 </Typography>
                  </Grid>
                  <Grid item>
                      <Button color='inherit' onClick={signout}>logout</Button>
                  </Grid>
              </Grid>
          </Toolbar>
      </AppBar>
  );

    var todoListPage = (
      <div>
        {navigationBar}
        <Container maxWidth="md">
          <AppTodo add={this.add} />
          <div className="TodoList">{todoItems}</div>
        </Container>
      </div>   
    );

    var loadingPage = <h1>로딩중</h1>;
    var content = todoListPage;


    return (
      <div className='App'>
        {content}
      </div>
    );
  }
}

export default App;
