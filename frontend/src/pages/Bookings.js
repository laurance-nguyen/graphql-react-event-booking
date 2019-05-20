import React, { Component } from 'react';

import AuthContext from '../context/auth-context'
import Spinner from '../components/Spinner/Spinner';

class BookingsPage extends Component {
	state = {
		isLoading: false,
		bookings: []
	}

	static contextType = AuthContext;

	componentDidMount() {
		this.fetchBookings();
	}

	fetchBookings = () => {
		this.setState({ isloading: true });
		const requestBody = {
			query: `
          query {
            bookings {
              _id
							createdAt
							updatedAt
							event{
								_id
								title
								date
							}
            }
          }
        `
		};

		fetch('http://localhost:5000/graphql', {
			method: 'POST',
			body: JSON.stringify(requestBody),
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + this.context.token
			}
		})
			.then(res => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error('Failed!');
				}
				return res.json();
			})
			.then(resData => {
				const bookings = resData.data.bookings;
				this.setState({ bookings: bookings, isLoading: null });
			})
			.catch(err => {
				console.log(err);
			});
	}

	render() {
		return (
			<React.Fragment>
				{this.state.isLoading ? <Spinner /> : (
					<ul>
						{this.state.bookings.map(booking => (
							<li key={booking._id}>{booking.event.title} - {new Date(booking.createdAt).toDateString()}</li>
						))}
					</ul>
				)}
			</React.Fragment>
	
			);
		}
	}
	
	export default BookingsPage;
