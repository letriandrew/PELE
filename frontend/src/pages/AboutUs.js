import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Avatar, CssBaseline, Divider } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { IconButton } from '@mui/material';

const teamMembers = [
  {
    name: 'Andrew Le',
    role: 'Founder & CEO',
    image: 'https://media.licdn.com/dms/image/v2/C5603AQFbX156wdDE6Q/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1639888880287?e=1732147200&v=beta&t=e0Lcxb5rwQOzP30Wfb_jC6qDRlEIpcfI6fW3KtcBLos',
    description: 'I am currently working as a Software Engineer at Panasonic Avionics Corporation while studying for my Masters in Data Science at the University of Colorado Boulder. Previously, I completed my Bachelors in Computer Science at California State University San Marcos. In my spare time I love to DJ, hike in nature, and watch sports! (Unfortunately I am a fan of the Dallas Cowboys...) Feel free to reach out on LinkedIn if you would like to connect!',
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

// Link to 2016 study
const studyLink = "https://psycnet.apa.org/record/2015-38251-001;"

const AboutUs = () => {
  return (
    <Box sx={{ padding: '40px' }}>
        <CssBaseline/>
      <Box sx={{ textAlign: 'center', marginBottom: '60px', marginTop: '90px' }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          What is PELE?
        </Typography>
        <Typography variant="h6" color="textSecondary">
          PELE stands for <strong>"Protégé Effect Learning Entity"</strong>.
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center', marginBottom: '60px', marginTop: '50px' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          What is the Protégé Effect?
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ maxWidth: '800px', margin: '0 auto' }}>
          The Protégé Effect is a learning concept that suggest that teaching a specific subject matter validates knowledge and induces effective learning. This is a also known as "learning by teaching". By explaining and teaching a concept to somebody, the teacher can develop their own understanding of the subject while identifying gaps in their own knowledge. In 2016, there was a <a href={studyLink} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', color: 'inherit' }}>study</a> that found that individuals that learn with the preparation to teach show a more complete knowledge of the material they are learning.
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center', marginBottom: '60px', marginTop: '50px' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Our Story
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ marginBottom: '16px', maxWidth: '800px', margin: '0 auto' }}>
          Here at PELE, we believe in this concept wholeheartedly. The issue is that what if somebody can't find somebody else to teach?
        </Typography>
        
        <Typography variant="h6" color="textSecondary" sx={{ marginTop: '15px', marginBottom: '14px' }}>
          The answer is <strong>PELE</strong>.
        </Typography>
        
        <Typography variant="body1" color="textSecondary" sx={{ marginBottom: '16px', maxWidth: '800px', margin: '0 auto' }}>
          With PELE, the goal is to provide a framework and application for somebody to teach a subject without needing a second individual. This is accomplished through PELE recording the subject matter that you are verifying your knowledge with and providing a plethora of questions created to better establish your understanding. With these questions, you can save them as well as tag various other denotations, like completion.
        </Typography>

        <Typography variant="body1" sx={{ marginTop: '20px' }}>
          To learn more about our application or about the creators of PELE, you can find out more below!
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center', marginBottom: '60px', marginTop: '50px' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
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
