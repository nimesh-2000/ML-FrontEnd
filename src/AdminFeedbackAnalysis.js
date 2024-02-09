import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { LinePlot } from '@mui/x-charts';
import { ChartsXAxis, ChartsYAxis } from '@mui/x-charts';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useEffect } from 'react';
import './Login.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

export default function AdminFeedbackAnalysis() {
  const [type, setType] = React.useState('bar');

  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [xAxisData, setXAxisData] = useState([]);
  const [negativeCount, setNegativeCount] = useState(0)
  const [postiveCount, setPostiveCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [isLoginSuccess, setIsLoginSuccess] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('');

  function handleUserNameChange(event) {
    setUserName(event.target.value);
  }
  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  const loginUser = (e) => {
    e.preventDefault();

    // Data to be sent to the backend
    const loginData = {
      name: userName,
      password: password
    };

    // Send login data to the backend
    fetch('http://localhost:5001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Login failed');

        }
        return response.json();
      })
      .then(data => {
        console.log(data); // Log the response from the backend
        // Handle successful login (if needed)

        setIsLogin(false);
        setIsLoginSuccess(true);
      })
      .catch(error => {
        console.error('Error:', error.message);
        // Handle login error (if needed)
        // alert(error.message);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Invalid User Name or Password",
          showConfirmButton: false,
          timer: 5000,
        });
      });

  }

  useEffect(() => {
    // Fetch data when the component mounts
    fetch('http://localhost:5001/get_all_data')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const feedbackData = data[0]; // Assuming the first item in the array contains the feedback data
          console.log('All Data:', feedbackData);

          setNegativeCount(feedbackData.negative_count);
          setPostiveCount(feedbackData.positive_count);
          setTotalCount(feedbackData.negative_count + feedbackData.positive_count);
        } else {
          console.error('Invalid data structure received from the API.');
        }

      })
      .catch((error) => {
        console.error('Error fetching feedback counts:', error.message);
      });

  }, []);


  useEffect(() => {
    // Fetch data when the component mounts
    fetch('http://localhost:5001/get_pie_chart_data')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Assuming your data structure matches the expected format for the charts
        // setBarChartData(data.map((item) => item.positive_count));
        const totalCount = data.reduce((acc, item) => acc + item.positive_count, 0);
        setPieChartData(
          data.map((item) => ({
            id: item.area,
            value: (item.positive_count / totalCount) * 100,
            label: `${mapServiceName(item.area)}`
          }))
        );
      })
      .catch((error) => {
        console.error('Error fetching data:', error.message);
        // Handle the error as needed
      });
  }, []);


  useEffect(() => {
    //   // Fetch data when the component mounts
    fetch('http://localhost:5001/get_chart_data')
      .then((response) => response.json())
      .then((data) => {
        const positiveCounts = data.map((item) => item.positive_count);
        const negativeCounts = data.map((item) => item.negative_count);
        const labels = data.map((item) => mapServiceName(item.area)); // Use your mapping function

        setBarChartData([
          {
            type,
            data: positiveCounts,
          },
          {
            type,
            data: negativeCounts,
          },
        ])
        setXAxisData(labels); // Set the xAxis data here

        console.log(data);
      })

  }, []);


  const mapServiceName = (originalName) => {
    // Map the original service names to new names
    switch (originalName) {
      case 'In-flight Service':
        return 'In-Flight Customer Care';
      case 'Uncategorized':
        return 'Other Services';
      default:
        return originalName;
    }
  };

  return (
     
    <div>
       {isLogin && (  
      <div className="card card-23" style={{ position: "absolute", top: 0, left: 0 }}>

        <div className="card-body">

          <div className="text-center">
            <h4>Log In</h4>
          </div>

          <form
            onSubmit={loginUser}

          >

            <div className="form-group mb-4">
              <div className="d-flex align-items-start ">
                <label
                  htmlFor="id_input_fm_1_userName"
                  className="col-form-label pt-0"
                >
                  User Name
                </label>
              </div>
              <input
                id="id_input_fm_1_userName"
                name="fm_1_userName"
                className="form-control"
                placeholder="Enter Your User Name"
                type="text"
                value={userName}
                onChange={handleUserNameChange}

                required
              />

            </div>
            <div className="form-group mb-4">
              <div className="d-flex align-items-start">
                <label
                  htmlFor="id_input_fm_1_password"
                  className="col-form-label pt-0"
                >
                  Password
                </label>
              </div>
              <input
                id="id_input_fm_1_password"
                name="fm_1_password"
                className="form-control"
                placeholder="Enter Your Password"
                type="password"
                value={password}
                onChange={(evt) => handlePasswordChange(evt)}
                required
                aria-describedby="basic-addon2"
              />
            </div>
            <div className="form-group form-row mt-3 mb-0 d-grid">
              <button className="btn btn-primary" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>

      </div>
      )}













      {isLoginSuccess && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* Total Feedback Count Card */}
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Card sx={{ width: '60%', margin: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)', borderRadius: '12px' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Total Feedback Count
                </Typography>
                <Typography variant="body2" sx={{ marginTop: '10px', fontSize: '20px', color: 'black', fontFamily: 'Protest Strike, sans-serif' }}>
                  Total Feedbacks: {totalCount}
                </Typography>
              </CardContent>
            </Card>

            {/* Positive Feedback Count Card */}
            <Card sx={{ width: '60%', margin: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)', borderRadius: '12px' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Positive Feedback Count
                </Typography>
                <Typography variant="body2" sx={{ marginTop: '10px', fontSize: '20px', color: 'black', fontFamily: 'Protest Strike, sans-serif' }}>
                  Positive Feedbacks: {postiveCount}
                </Typography>
              </CardContent>
            </Card>

            {/* Negative Feedback Count Card */}
            <Card sx={{ width: '60%', margin: '20px', height: '60%', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)', borderRadius: '12px' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Negative Feedback Count
                </Typography>
                <Typography variant="body2" sx={{ marginTop: '10px', fontSize: '20px', color: 'black', fontFamily: 'Protest Strike, sans-serif' }}>
                  Negative Feedbacks: {negativeCount}
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Card sx={{ width: '60%', margin: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)', borderRadius: '12px' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Feedback Analysis Bar Chart
              </Typography>
              <ResponsiveChartContainer
                colors={['green', 'red']}
                series={barChartData}
                xAxis={[
                  {
                    data: xAxisData, // Use the dynamic xAxis data here
                    scaleType: 'band',
                    id: 'x-axis-id',
                  },
                ]}
                yAxis={[
                  {
                    scaleType: 'linear',
                    id: 'y-axis-id',
                  },
                ]}
                height={400}

              >
                <BarPlot />
                <LinePlot />
                <ChartsXAxis label="Feedback Categories" position="bottom" axisId="x-axis-id" />
                <ChartsYAxis label="Feedback Value" position="left" axisId="y-axis-id" />
              </ResponsiveChartContainer>
              <Typography variant="body2" sx={{ marginTop: '10px', fontSize: '20px', color: 'black', fontFamily: 'Protest Strike, sans-serif' }}>
                This bar chart represents the feedback from Airbus passengers, showcasing both positive and negative values. Each bar corresponds to a specific feedback category, allowing for an in-depth analysis of sentiments.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ width: '60%', margin: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)', borderRadius: '12px' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Feedback Analysis Pie Chart
              </Typography>
              <PieChart

                colors={['yellow', 'pink', 'brown', 'orange']}
                series={[
                  {
                    data: pieChartData,
                  },
                ]}
                width={800}
                height={400}
              />
              <Typography variant="body2" sx={{ marginTop: '10px', fontSize: '20px', color: 'black', fontFamily: 'Protest Strike, sans-serif' }}>
                This pie chart represents the percentage distribution of positive feedback among different service areas. It provides a visual overview of the areas that received positive responses from passengers, contributing to a comprehensive understanding of customer satisfaction.
              </Typography>
            </CardContent>
          </Card>
        </Box>

      )}
    </div>
  );
}
