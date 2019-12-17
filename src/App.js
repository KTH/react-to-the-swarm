import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import Service from './Service';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [services, setServices] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getServices = async () => {
      var result = await fetch('http://localhost:3001/services');
      var resultJson = await result.json();
      setServices(resultJson);
    }
    getServices();
  }, []);

  useEffect(() => {
    const getTasks = async () => {

    };
    getTasks();
  }, [services])

  function chunk(arr, size) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  }

  function serviceCards() {
    const columns = 3;
    let serviceChunks = chunk(services, columns);
    return (
      serviceChunks.map(c => {
        return (
          <React.Fragment>
            <Row>
              {c.map(s => {
                return <Service service={s} columns={columns}></Service>
              })}
            </Row>
            <br />
          </React.Fragment>
        )
      })
    )
  };

  return (
    <div className="App">
      <header className="App-header">
        <Container>
          {serviceCards()}
        </Container>
      </header>
    </div>
  );
}

export default App;
