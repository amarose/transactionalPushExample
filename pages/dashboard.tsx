import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Dashboard: React.FC = () => {
  const router = useRouter();

  const [user, setUser] = useState<{ username: string; id: string } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState("");
  const [subId, setSubId] = useState("");

  const handleGettingPPGSubID = async () => {
    try {
      const response = await fetch(
        `https://api.pushpushgo.com/core/projects/651ff5c87582a8ac33d89ec6/external_ids/${user?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Token": "39cd0aa0-072f-4f59-b5f2-c67fdfe5980d",
          },
        }
      );

      if (response.ok) {
        const subscriberIdArray = await response.json();
        const subscriberId = subscriberIdArray.subscriberIds[0];
        setSubId(subscriberId);
        setDisplayText("PPG Subscriber connected with YOUR CUSTOMER ID(from dataLayer): " + subscriberId);
      } else {
        const errorData = await response.json();
        setError("PPG request failed: " + errorData.error);
        console.error("PPG request failed: ", errorData.error);
      }
    } catch (error: any) {
      setError("Request failed: " + error.message);
      console.error("Request failed: ", error.message);
    }
  };

  const handlePushSendWhenContractExpired = async () => {
    try {
      const response = await fetch(
        `https://api.pushpushgo.com/core/projects/651ff5c87582a8ac33d89ec6/pushes/transaction`,
        {
          method: "POST",
          body: JSON.stringify({
            omitCapping: true,
            message: {
              actions: [
                {
                  clickUrl: "https://test.com",
                  title: "Test action",
                },
              ],
              title: "Test - your contract will expire in 30 days",
              content: "Contact us",
              clickUrl: "https://test.com",
              requireInteraction: true,
              direction: "ltr",
              ttl: 70,
            },
            to: subId,
          }),
          headers: {
            "Content-Type": "application/json",
            "X-Token": "39cd0aa0-072f-4f59-b5f2-c67fdfe5980d",
          },
        }
      );

      if (response.ok) {
        setDisplayText("Push send succesfully");
      } else {
        const errorData = await response.json();
        setError("PPG request failed: " + errorData.error);
        console.error("PPG request failed: ", errorData.error);
      }
    } catch (error: any) {
      setError("Request failed: " + error.message);
      console.error("Request failed: ", error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    if (window.dataLayer) {
      window.dataLayer = window.dataLayer.filter(
        (event) => event.event !== "userLoggedIn"
      );
    }
    router.push("/");
  };

  useEffect(() => {
    // Check if localStorage is available on the client side
    if (typeof window !== "undefined") {
      // Retrieve userData from localStorage
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
      }
    }
  }, []);

  return (
    <div>
      {user ? (
        <h1>
          Welcome, {user.username} (ID: {user.id})
        </h1>
      ) : (
        <h1>Welcome to the Dashboard!</h1>
      )}
      <button onClick={handleGettingPPGSubID} className="test-button">
        Get PPG subscribers IDS connected with dataLayer ID
      </button>
      <button
        onClick={handlePushSendWhenContractExpired}
        className="test-button"
      >
        Trigger contract expiration
      </button>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
      {error && <p className="error-message">{error}</p>} {}
      {displayText && <p className="test-text">{displayText}</p>}
      <style jsx>{`
        div {
          text-align: center;
          margin-top: 100px;
        }
        .test-button {
          padding: 10px 20px;
          font-size: 18px;
          cursor: pointer;
          margin-right: 20px;
        }
        .test-text {
          padding: 50px;
          font-size: 24px;
          margin-top: 20px;
          text-align: center;
        }
        .logout-button {
          padding: 10px 20px;
          font-size: 18px;
          cursor: pointer;
          background-color: #ff0000;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
