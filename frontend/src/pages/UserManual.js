import React from 'react';
import { Box, Typography, Card, CardContent, Divider, List, ListItem, ListItemText, ListItemIcon, CssBaseline } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import StepIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Markdown from 'markdown-to-jsx';

const UserManual = () => {
  const descriptionFontSize = 18

  const steps = [
    {
      icon: <InfoIcon />,
      title: 'Getting Started',
      description: `###To begin using the platform, follow these steps:
1.) If you haven't created an account yet, sign up and register an account with PELE.
2.) Once signed in, you have access to the recoring module and can begin studying!`
    },
    {
      icon:<StepIcon />,
      title: 'Using the Recorder',
      description: `###Learn how to utilize PELE to enhance your learning:
1.) Click on the record button at the top.
2.) Press record and begin your "lecture"! 
3.) As soon as you finish, press stop recording. You can then either generate questions based off the recording or rerecord the "lesson" if you need by deleting it using the trashcan button on the recording.
4.) Once you've waited for the questions to generate, you can either go back to record or save your question set!
5.) To access the questions and track your progress, you can click on the Dashboard button at the top and find all the tools needed to use your question set!`
    },
    {
      icon:<HelpOutlineIcon />,
      title: 'FAQ',
      description: `###Here are answers to some commonly asked questions:
1.) **Lorem ipsum odor amet?** 
consectetuer adipiscing elit. Conubia commodo ac proin sociosqu sociosqu. 
2.) **Taciti ad dolor elit nostra quisque consequat?** 
Fusce cursus nam tempor; mattis habitant elit potenti finibus. 
3.) **Hendrerit elementum?** 
viverra tristique maecenas ex quis sapien.`
    },
  ];

  return (
    <Box sx={{ padding: 4, maxWidth: '900px', margin: 'auto', marginTop: '120px' }}>
      <CssBaseline />

      <List>
        {steps.map((step, index) => (
          <Card key={index} sx={{ marginBottom: 2 }}>
            <CardContent>
              <ListItem>
                <ListItemIcon>
                  {step.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      {step.title}
                    </Typography>
                  }
                  secondary={
                    <Markdown
                      options={{ forceBlock: true }}
                      style={{ color: 'textSecondary', whiteSpace: 'pre-line' }}
                    >
                      {step.description}
                    </Markdown>
                  }
                />
              </ListItem>
            </CardContent>
          </Card>
        ))}
      </List>
    </Box>
  );
};

export default UserManual;
