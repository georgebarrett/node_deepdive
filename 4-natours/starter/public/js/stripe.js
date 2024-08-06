/* eslint-disabled */
import axios from "axios";
import { showAlert } from "./alerts";
import Stripe from "stripe";

const stripe = Stripe('pk_test_51PkTwGJ0vvqHKdEf6rmOYIzwycW34srX3gXxXpr3Wsq9SzypAnhoe8o6elZYsDg50GtoRLugF3fkr31B7ZnI0jyW00fvHEJf0p');

export const bookTour = async (tourId) => {
    try {
        // tourId from index.js is passed into this URL, which returns a checkout session 
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
        
        if (!session.data || !session.data.session) {
            throw new Error('no session data found')
        }

        // create checkout form & charge card
        // session is the api call, data is what is returned, session is a field in that data, url is the stripe url a user will be taken to
        window.location.replace(session.data.session.url);

    } catch (error) {
        console.log(error);
        showAlert('error', error);
    }  
};
