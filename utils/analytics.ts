interface UserData {
    username: string;
    id: string;
  }
  
export function pushUserDataToDataLayer(username: string, id: string): void {
    const userData: UserData = { username, id };
  
    // Check if a 'userData' event already exists in the dataLayer
    const existingUserDataEventIndex = (window as any).dataLayer.findIndex(
      (event: any) => event.event === 'userLoggedIn'
    );
  
    if (existingUserDataEventIndex !== -1) {
      // If the event exists, update it with the new user data
      (window as any).dataLayer[existingUserDataEventIndex].userData = userData;
    } else {
      // If the event doesn't exist, push a new 'userData' event to the dataLayer
      (window as any).dataLayer.push({
        event: 'userLoggedIn',
        userData,
      });
    }
  
    // Store the user data in localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
  }
  
  