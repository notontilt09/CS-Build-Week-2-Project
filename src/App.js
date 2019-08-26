import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';

const apiKey = '666886a8a4b4954ee5738c3dca6bcd3c66684beb'
const authHeader = {
  headers: {
    Authorization: `Token ${apiKey}`
  }
}
const baseUrl = 'https://lambda-treasure-hunt.herokuapp.com/api'
const initialRoomState = {'n': '?', 's': '?', 'e': '?', 'w': '?'};

const graph = {}

const App = () => {
  const [currentRoom, setCurrentRoom] = useState({});
  // const [graph, setGraph] = useState({0: {'n': '?', 's': '?', 'e': '?', 'w': '?'}});

  
  // initialize map 
  useEffect(() => {
    axios.get(`${baseUrl}/adv/init`, authHeader)
    .then(res => {
      console.log(res);
      setCurrentRoom(res.data)
      graph[res.data.room_id] = {};
      const exits = res.data.exits;
      exits.forEach(exit => 
        graph[res.data.room_id][exit] = '?'  
      );
      console.log(graph);
    })
    .catch(err => console.log(err))
  }, [])

  const flip = direction => {
    if (direction === 'n') {
      return 's';
    } else if (direction === 's') {
      return 'n';
    } else if (direction === 'e') {
      return 'w';
    } else if (direction === 'w') {
      return 'e';
    }
  }

  
  // method to move a player in a given direction.  Also updates the graph of currentRoom and next Room
  const move = direction => {
    axios.post(`${baseUrl}/adv/move`, {"direction": direction}, authHeader)
    .then(res => {
      console.log(res)
      const currRoom = res.data.room_id;
      const exits = res.data.exits;
      const oldRoom = currentRoom.room_id;
      if (!graph[currRoom]) {
        graph[currRoom] = {}
        exits.forEach(exit => {
          graph[currRoom][exit] = '?'
        })
      }
      graph[oldRoom][direction] = currRoom;
      graph[currRoom][flip(direction)] = oldRoom;
      console.log(graph);
      // setGraph({...graph, 
      //   [currRoom]: {
      //     ...initialRoomState,
      //     [flip(direction)]: oldRoom
      //   },
      //   [oldRoom]: {
      //     ...graph[oldRoom],
      //     [direction]: currRoom
      //   }
      // })
      setCurrentRoom(res.data)
    })
    .catch(err => console.log(err));
  }
  
  const dft_to_dead_end = start => {
    
    // DFT to get to a dead end
  }

    return (
      <div className="App">
        <div className="room-info">
          <div>
            Room: {currentRoom.room_id} 
          </div>
          <div>
            Cooldown: {currentRoom.cooldown}
          </div>
          <div>
            Coordinates: {currentRoom.coordinates}
          </div>
          <div>
            Description: {currentRoom.description} 
          </div>
          <div>
            Elevation: {currentRoom.elevation}
          </div>
          <div>
            Errors:{currentRoom.errors}
          </div>
          <div>
            Exits: {currentRoom.exits} 
          </div>
          <div>
            Items: {currentRoom.items} 
          </div>
          <div>
            Messages: {currentRoom.messages} 
          </div>
          <div>
            Players: {currentRoom.players} 
          </div>
          <div>
            Terrain: {currentRoom.terrain}  
          </div>
          <div>
            Title: {currentRoom.title} 
          </div>
        </div>
        <div className="controls">
          {currentRoom.exits && currentRoom.exits.map(exit => 
            <button key={exit} className="move-btn" onClick={() => move(exit)}>{exit.toUpperCase()}</button>
          )}
        </div>
    </div>
  );
}

export default App;
