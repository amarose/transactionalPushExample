# Preview
This exmaple provides a simplified solution for implementing transactional push notification.
Dictionary:
* **User ID:** ID of customer from your platform
* **Subscriber ID:** ID of user subscribed to notifications  (PPG)

Test case part 1 (these steps are required to connect Users from your system to their IDs in PPG):
1. User subscribes to notifications and recieves **Subscriber ID** / User is already subscribed
2. User loggs into application
3. **User ID** is appended to dataLayer after login
4. PPG collects **User ID** from dataLayer (by creating selector in PPG app)
5. User leaves site - after 15 minutes **User ID** is matched with **Subscriber ID** in PPG app

Test case part 2 (send push to matched Subscriber)
6. Set up trigger for sending push notification, when your User contract expires in less than 30 days. (In this example we set up button for triggering that action)
7. After clicking button, push notification will be sent

# Implementation
To make transactional push work in your platform you have to complete 4 steps:
1. Send your Users ID to the data layer
2. Generate API key for your project (https://app.pushpushgo.com/user/access-manager/keys)
3. Implement endpoint for getting **Subscriber ID** 
```typescript
// Replace PROJECT_ID with your project ID - you can get it from PPG app
// Replace USER_ID with your User ID
// Replace API_KEY with key generated in step 2
const  response  =  await  fetch(
	`https://api.pushpushgo.com/core/projects/PROJECT_ID/external_ids/USER_ID`,
	{
		method:  "GET",
		headers: {
			"Content-Type":  "application/json",
			"X-Token":  "API_KEY",
		},
	}
);
```
This request will return array of subscriber IDs linked to given USER_ID. In your case it should return only 1 element inside array.
```typescript
{​
	"externalId":  "string",​
	"subscriberIds":  [​
		"string"​
	]​
​}
```
4.  After receiving Subscriber ID from previous step. Implement sending transactional push. Endpoint with example payload:
```typescript
// Replace PROJECT_ID with your project ID - you can get it from PPG app
// Replace SUBSCRIBER_ID with ID received from previous endpoint
// Replace API_KEY with key generated in step 2
const  response  =  await  fetch(
	`https://api.pushpushgo.com/core/projects/PROJECT_ID/pushes/transaction`,
	{	
		method:  "POST",
		body:  JSON.stringify({
		omitCapping:  true,
		message: {
			actions: [
				{
					clickUrl:  "https://test.com",
					title:  "Test action",
				},
			],
			title:  "Test - your contract will expire in 30 days",
			content:  "Contact us",
			clickUrl:  "https://test.com",
			requireInteraction:  true,
			direction:  "ltr",
			ttl:  70,
		},
		to:  SUBSCRIBER_ID,
		}),
		headers: {
			"Content-Type":  "application/json",
			"X-Token":  "API_KEY",
		},
	}
);
``` 
# Testing
To run example locally:
```bash
npm install
npm run dev
```
or you can test it on test site:
`https://exampletransactionaltestcase.vercel.app/`

Example includes 3 users:
```json
{ id:  "1111", username:  "user1", password:  "password1" },

{ id:  "2222", username:  "user2", password:  "password2" },

{ id:  "3333", username:  "user3", password:  "password3" },
```
**IMPORTANT**: While testing, you should use one user per one browser profile to maintain real life example.

#### Test exaple using user1 and test domain:
1. Open new browser profile
2. Go to site: https://exampletransactionaltestcase.vercel.app/
3. Subscribe to notifications (User is not logged in yet, so for now we only know his subscriber ID)
4. Login in using credentials - user1, password1
5. After 1-2 seconds you will be logged into dashboard. You can open dataLayer (window.dataLayer) in console and. There should be user1 ID - 1111. While  user is logged in, PPG selector collects that user ID from dataLayer
6. Leave the site and wait for 15 mins (this is the time required to process the data). After that time User will be matched with his Subscriber ID in PPG app.
7. Now you can enter https://exampletransactionaltestcase.vercel.app/ again and  login to user1 account. You can click button called **Get PPG subscribers IDS connected with dataLayer ID** (it should display Subscriber ID of user1, so it means that User ID and Subscriber ID are matched correctly)
8. Trigger the transactional push by clicking on button **Trigger contract expiration**
9. You should receive push notification shortly