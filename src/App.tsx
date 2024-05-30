import { useState } from 'react';
import './app.css';

function App() {
    const [userLink, setUserLink] = useState('');
    const [shortenedLink, setShortenedLink] = useState('');

    const handleUserEnterLink = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserLink(event.target.value);
    };

    const sendOrderToBackend = async (link: string) => {
        try {
            const response = await fetch('http://localhost:5000/api/short', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ origUrl: link }), // Send as an object
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            setShortenedLink(responseData.shortUrl);
            console.log('Link successfully submitted:', responseData);
        } catch (error) {
            console.error('Error submitting Link:', error);
        }
    };

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        sendOrderToBackend(userLink);
    };

    return (
        <div className="d-flex flex-column align-items-center">
          <h1 className='m-5'>URL Shortener</h1>
          <form className='d-flex text-center flex-column input-group-prepend'>
            <input type='text' className='form-control' style={{width:'500px'}} onChange={handleUserEnterLink} value={userLink} />
          <button type='submit' className='m-auto my-5 btn btn-primary btn-lg' onClick={handleSubmit}>Shorten URL and Copy to Clipboard</button>
          </form>
          <input type='text' value='AAA' className='form-control' style={{width:'500px'}} readOnly />
          <button type='button' className='m-auto my-5 btn btn-secondary btn-lg'>Generate QR code</button>
        </div>
    );
}

export default App;
