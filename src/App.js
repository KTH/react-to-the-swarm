import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import Service from './Service';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [services, setServices] = useState([]);

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
    let chunkNr = 0;
    let serviceChunks = chunk(services, columns);
    return (
      serviceChunks.map(chunk => {
        chunkNr++;
        return (
          <React.Fragment key={chunkNr}>
            <Row>
              {chunk.map(service => {
                return <Service key={service.ID} service={service} columns={columns}></Service>
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
