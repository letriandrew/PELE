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
1.) Lorem ipsum odor amet, consectetuer adipiscing elit. Conubia commodo ac proin sociosqu sociosqu. 
2.) Taciti ad dolor elit nostra quisque consequat. Fusce cursus nam tempor; mattis habitant elit potenti finibus. 
3.) Hendrerit elementum viverra tristique maecenas ex quis sapien. 
4.) Lobortis felis maecenas rhoncus aenean rutrum sapien. Dictumst ullamcorper vestibulum molestie phasellus amet enim facilisi. 
5.) Dui odio nisi velit tempus luctus porta nam. Nulla potenti rhoncus ridiculus maecenas phasellus vitae. Quam mus erat cubilia et eget feugiat.`
    },
    {
      icon:<StepIcon />,
      title: 'Using the Recorder',
      description: `###Learn how to utilize PELE to enhance your learning:
- Lorem ipsum odor amet, consectetuer adipiscing elit. Conubia commodo ac proin sociosqu sociosqu. 
- Taciti ad dolor elit nostra quisque consequat. Fusce cursus nam tempor; mattis habitant elit potenti finibus. 
- Hendrerit elementum viverra tristique maecenas ex quis sapien. 
- Lobortis felis maecenas rhoncus aenean rutrum sapien. Dictumst ullamcorper vestibulum molestie phasellus amet enim facilisi.`
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
