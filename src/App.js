import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'
import Greeter from './abi/Greeter.json'

const greeterAddress = `${process.env.REACT_APP_GREETER_CONTRACT_ADDRESS}`;

function App() {
  const [greeting, setGreetingValue] = useState();

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // get the current greeting value from the contract
  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
        setGreetingValue(data);
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  // Call the contract to set a new greeting string
  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      await transaction.wait();
      fetchGreeting();
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h3>{greeting}</h3>
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <br />
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="New greeting" />
        <button onClick={setGreeting}>Set Greeting</button>
      </header>
    </div>
  );
}

export default App;
