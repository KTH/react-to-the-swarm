import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import Service from './Service';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AppContext } from './AppContext.js';

function App() {

  const [services, setServices] = useState([]);
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const getServices = async () => {
      var result = await fetch('http://localhost:3001/services');
      var resultJson = await result.json();
      setServices(resultJson);
    }
    const updateColumns = () => {
      if (window.innerWidth < 1000 && window.innerWidth > 500) setColumns(2);
      else if (window.innerWidth <= 500) setColumns(1);
      else setColumns(3);
    }
    window.addEventListener('resize', updateColumns);
    getServices();
    return () => window.removeEventListener('resize', updateColumns);
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
    <AppContext>
      <div className="App">
        <header className="App-header">
          <Container>
            {serviceCards()}
          </Container>
        </header>
      </div>
    </AppContext>
  );
}

export default App;
