import React, { FC, useEffect, useState } from 'react';

import {
  Grid,
  Box,
  Flex,
  Text,
  Button,
  Textarea,
  FileButton,
  FileInput,
  Chip,
  Group,
  Slider,
} from '@mantine/core';

const TextToSpeech: FC = () => {
  const [text, setText] = useState<string>('Welcome to Microapp.io');
  const [textFile, setTextFile] = useState<File | null>(null);
  // alloy, echo, fable, onyx, nova, and shimmer
  const [audioOption, setAudioOption] = useState<
    'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  >('alloy');
  // The format to audio in. Supported formats are mp3, opus, aac, and flac.
  const [audioFormat, setAudioFormat] = useState<
    'mp3' | 'opus' | 'aac' | 'flac'
  >('mp3');
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(false);
  const [speechFile, setSpeechFile] = useState<File | null>(null);

  useEffect(() => {
    if (textFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setText(e.target.result.toString());
        }
      };
      reader.readAsText(textFile);
    }
  }, [textFile]);

  const base64ToBlob = (base64: string, mime: string) => {
    const binaryString = atob(base64.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binaryString.length; i++) {
      uintArray[i] = binaryString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mime });
  };



  const handleTextToSpeech = async () => {
    setLoading(true);
    const response = await fetch('/api/textToSpeech', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        text,
        audioOption,
        audioFormat,
        audioSpeed,
      }),
    });
    const {base64} = await response.json();
    const blob = base64ToBlob(base64, 'audio/mpeg');
    const file = new File([blob], 'speech.' + audioFormat, {
      type: 'audio/mpeg',
    });
    setSpeechFile(file);
    setLoading(false);
  };

  const handleDownload = () => {
    if (speechFile) {
      const url = URL.createObjectURL(speechFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = speechFile.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      <Grid h={'100%'} m={0}>
        <Grid.Col
          sx={(theme) => ({
            backgroundColor: '#FDFDFD',
          })}
          sm={12} // On small screens, take the full width
          md={8} // On medium screens, take half of the width
        >
          <Box
            w={{
              base: '100%',
              md: '90%',
            }}
            sx={(theme) => ({
              boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.165)',
              backgroundColor: '#FFFFFF',
              borderRadius: '15px',
            })}
            my={{
              base: '5%',
              md: '3%',
            }}
            mx={{
              base: 0,
              md: '5%',
            }}
            p={{
              base: 8,
              md: 16,
            }}
          >
            <Flex direction={'column'}>
              <Textarea
                label="Type/Paste your text here"
                placeholder=""
                value={text}
                onChange={(event) => setText(event.currentTarget.value)}
                minRows={8}
                maxRows={8}
              />
              <Text
                style={{
                  textAlign: 'right',
                }}
                color={text.length > 500 ? '#fb0202' : 'gray'}
              >
                {text.length}/500 characters
              </Text>
            </Flex>
            <Flex my={8}>
              <FileButton
                accept=".txt"
                onChange={(file) => {
                  setTextFile(file);
                }}
              >
                {(props) => (
                  <Button
                    {...props}
                    variant="light"
                    color="violet"
                    size="sm"
                    style={{
                      border: '1px solid',
                      borderTopRightRadius: '0px',
                      borderBottomRightRadius: '0px',
                      zIndex: 1,
                    }}
                    mr={'-4px'}
                    w={'120px'}
                  >
                    Browse
                  </Button>
                )}
              </FileButton>
              <FileInput
                color="violet"
                iconWidth={'0px'}
                accept=".txt"
                value={textFile}
                onChange={(file) => {
                  setTextFile(file);
                }}
                placeholder={'No file selected'}
                w={'100%'}
                maw={'calc(100% - 120px)'}
                size="sm"
                style={{
                  borderTopLeftRadius: '0px',
                  borderBottomLeftRadius: '0px',
                }}
              />
            </Flex>
            <Text
              style={{
                textAlign: 'center',
                color: 'gray',
              }}
            >
              Upload a text file (.txt) to convert it to speech
            </Text>
          </Box>
          {speechFile && (
            <Box
              w={{
                base: '100%',
                md: '90%',
              }}
              sx={(theme) => ({
                boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.165)',
                backgroundColor: '#FFFFFF',
                borderRadius: '15px',
              })}
              my={{
                base: '5%',
                md: '3%',
              }}
              mx={{
                base: 0,
                md: '5%',
              }}
              p={{
                base: 8,
                md: 16,
              }}
            >
              <Text size={'sm'} weight={700}>
                Speech
              </Text>
              <audio
                controls
                src={URL.createObjectURL(speechFile)}
                style={{
                  width: '100%',
                }}
              />
            </Box>
          )}
        </Grid.Col>
        <Grid.Col
          sx={(theme) => ({
            backgroundColor: '#FDFDFD',
          })}
          sm={12} // On small screens, take the full width
          md={4} // On medium screens, take half of the width
        >
          <Box
            m={{
              base: 0,
              md: '3%',
            }}
            mt={{
              base: '110px',
              md: '5%',
            }}
            bg={'#f5f7f9'}
            p={16}
            style={{
              boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.165)',
              backgroundColor: '#FFFFFF',
              borderRadius: '15px',
            }}
          >
            <Text size={'sm'} weight={700}>
              Audio Option
            </Text>
            <Chip.Group
              multiple={false}
              onChange={(value) =>
                setAudioOption(
                  value as
                  | 'alloy'
                  | 'echo'
                  | 'fable'
                  | 'onyx'
                  | 'nova'
                  | 'shimmer'
                )
              }
              value={audioOption}
            >
              <Group my={8}>
                <Chip value={'alloy'} color={'violet'} variant="filled">
                  Alloy
                </Chip>
                <Chip value={'echo'} color={'violet'} variant="filled">
                  Echo
                </Chip>
                <Chip value={'fable'} color={'violet'} variant="filled">
                  Fable
                </Chip>
              </Group>
              <Group my={8}>
                <Chip value={'onyx'} color={'violet'} variant="filled">
                  Onyx
                </Chip>
                <Chip value={'nova'} color={'violet'} variant="filled">
                  Nova
                </Chip>
                <Chip value={'shimmer'} color={'violet'} variant="filled">
                  Shimmer
                </Chip>
              </Group>
            </Chip.Group>
            <Text size={'sm'} weight={700} mt={16}>
              Audio Format
            </Text>
            <Chip.Group
              multiple={false}
              onChange={(value) =>
                setAudioFormat(value as 'mp3' | 'opus' | 'aac' | 'flac')
              }
              value={audioFormat}
            >
              <Group my={8} align="center">
                <Chip value={'mp3'} color={'violet'} variant="filled">
                  MP3
                </Chip>
                <Chip value={'opus'} color={'violet'} variant="filled">
                  Opus
                </Chip>
              </Group>
              <Group my={8} align="center">
                <Chip value={'aac'} color={'violet'} variant="filled">
                  AAC
                </Chip>
                <Chip value={'flac'} color={'violet'} variant="filled">
                  FLAC
                </Chip>
              </Group>
            </Chip.Group>
            <Text size={'sm'} weight={700} mt={16}>
              Audio Speed
            </Text>
            <Slider
              value={audioSpeed}
              onChange={(value) => setAudioSpeed(value)}
              min={0.25}
              max={4}
              step={0.05}
              labelTransition="fade"
              labelTransitionDuration={200}
              labelTransitionTimingFunction="ease"
              label={(value) => `${value}x`}
              style={{
                width: '100%',
              }}
              marks={[
                { value: 0.25, label: '0.25x' },
                { value: 1, label: '1x' },
                { value: 2, label: '2x' },
                { value: 4, label: '4x' },
              ]}
              color="violet"
              mb={24}
              mt={16}
            />
            <Button
              mt={32}
              color="violet"
              variant="light"
              style={{
                border: '1px solid',
              }}
              fullWidth
              onClick={handleTextToSpeech}
              loading={loading}
            >
              Convert to Speech
            </Button>
            <Button
              mt={16}
              color="violet"
              variant="light"
              style={{
                border: '1px solid',
              }}
              fullWidth
              onClick={handleDownload}
              disabled={!speechFile}
            >
              Download
            </Button>
          </Box>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default TextToSpeech;