import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Avatar, CssBaseline } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { IconButton } from '@mui/material';

const teamMembers = [
  {
    name: 'Andrew Le',
    role: 'Founder & CEO',
    image: 'https://media.licdn.com/dms/image/v2/C5603AQFbX156wdDE6Q/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1639888880287?e=1732147200&v=beta&t=e0Lcxb5rwQOzP30Wfb_jC6qDRlEIpcfI6fW3KtcBLos',
    description: 'Andrew is a visionary leader with a passion for innovation and technology.',
    githubLink: 'https://github.com/letriandrew',
    linkedInLink: 'https://www.linkedin.com/in/letriandrew/',
  },
  {
    name: 'Christian Manibusan',
    role: 'Product Manager',
    image: 'https://media.licdn.com/dms/image/v2/D5603AQHsfqoza5jUHQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1716026398972?e=1732147200&v=beta&t=77oo-Xfr3yVqlBeZidYXH0gds806RF1XMcYzDiZIwxU',
    description: 'Christian ensures our products are top-notch and user-focused.',
    githubLink: 'https://github.com/kikijee',
    linkedInLink: 'https://www.linkedin.com/in/christian-manibusan-885005259/',
  },
];

const AboutUs = () => {
  return (
    <Box sx={{ padding: '40px' }}>
        <CssBaseline/>
      <Box sx={{ textAlign: 'center', marginBottom: '50px', marginTop: '90px' }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          About Us
        </Typography>
        <Typography variant="h6" color="textSecondary">
          We are a passionate team dedicated to building innovative solutions for people everywhere.
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center', marginBottom: '50px', marginTop: '90px' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Our Story
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ maxWidth: '800px', margin: '0 auto' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit 
        esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
        culpa qui officia deserunt mollit anim id est laborum.
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center', marginBottom: '50px', marginTop: '90px' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Meet Our Team
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ textAlign: 'center', padding: '20px', borderRadius: '10px' }}>
                <Avatar
                  alt={member.name}
                  src={member.image}
                  sx={{ width: 120, height: 120, margin: '0 auto', marginBottom: '20px' }}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {member.role}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" sx={{ marginTop: '10px' }}>
                    {member.description}
                  </Typography>
                  <IconButton href={member.githubLink}><GitHubIcon sx={{fontSize:35}}/></IconButton>
                  <IconButton href={member.linkedInLink}><LinkedInIcon sx={{fontSize:35}}/></IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ textAlign: 'center', padding: '20px 0', borderTop: '1px solid #ddd' }}>
        <Typography variant="body2" color="textSecondary">
          &copy; {new Date().getFullYear()} PELE Inc. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default AboutUs;
