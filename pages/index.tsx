import React, { FC, useEffect, useState } from 'react';
import { GeistSans } from 'geist/font/sans';
import {
  Grid,
  Box,
  Flex,
  Text,
  Button,
  Textarea,
  FileButton,
  FileInput,
  Group,
  Slider,
  ColorScheme,
  MantineProvider,
  ColorSchemeProvider,
  Divider,
} from '@mantine/core';
import StyledButton from '@/components/StyledButton';
import { IconDownload, IconRefresh } from '@tabler/icons-react';
import AudioPlayer from './AudioPlayer';

type Language = 'en' | 'es' | 'pt';

type HomeProps = {
  theme?: string; // 'light' | 'dark'
  lang?: Language; // 'en' | 'es' | 'pt'
};

const Home: React.FC<HomeProps> = (props) => {
  const [app_theme, setAppTheme] = useState<string>(props.theme || 'light');
  const toggleColorScheme = (value?: ColorScheme) => {
    // console.log('Toggle color scheme', value);
    setAppTheme(value === 'dark' ? 'dark' : 'light');
  };
  useEffect(() => {
    if (props.theme) {
      toggleColorScheme(props.theme === 'dark' ? 'dark' : 'light');
    }
  }, [props.theme]);
  const [app_lang, setAppLang] = useState<'en' | 'es' | 'pt'>(
    props.lang || 'en'
  );
  useEffect(() => {
    // console.log('PROPS: ', props);
    if (props.lang) {
      setAppLang(props.lang);
    }
  }, [props.lang]);

  const [text, setText] = useState<string>(
    translations[app_lang].INPUT_PLACEHOLDER
  );
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
    const response = await fetch(
      'https://text-to-speech-blond.vercel.app/api/textToSpeech',
      {
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
      }
    );
    const { base64 } = await response.json();
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
      <ColorSchemeProvider
        colorScheme={app_theme === 'dark' ? 'dark' : 'light'}
        toggleColorScheme={() => {}}
      >
        <MantineProvider
          theme={{
            colorScheme: app_theme === 'dark' ? 'dark' : 'light',
            fontFamily: GeistSans.style.fontFamily,
          }}
          withGlobalStyles
          withNormalizeCSS
        >
          <Grid
            py={48}
            px={8}
            w={'100%'}
            mih={'100vh'}
            style={{
              backgroundColor: app_theme === 'dark' ? '#000' : '#fff',
            }}
            m={0}
          >
            <Grid.Col
              sx={() => ({
                borderRight: '1px solid',
                borderColor: app_theme === 'dark' ? '#2C2C30' : '#C5C5C9',
              })}
              sm={6}
              md={6}
              lg={6}
              w={'100%'}
              pl={{
                base: 8,
                md: 60,
                lg: 60,
              }}
              pr={{
                base: 8,
                md: 24,
                lg: 24,
              }}
            >
              <Box w={{ base: '100%' }}>
                <Flex direction={'column'} justify={'flex-start'}>
                  <Textarea
                    label={
                      <Text
                        mb={12}
                        style={{
                          fontWeight: '600',
                        }}
                        size={'lg'}
                      >
                        {translations[app_lang].INPUT_LABEL}
                      </Text>
                    }
                    placeholder=""
                    value={text}
                    onChange={(event) => setText(event.currentTarget.value)}
                    maxLength={500}
                    minRows={8}
                    maxRows={8}
                    mb={8}
                    radius={'24px'}
                    styles={{
                      input: {
                        background: 'transparent',
                      },
                    }}
                  />
                  <Text
                    style={{
                      textAlign: 'right',
                    }}
                    mb={24}
                    color={text.length > 500 ? '#fb0202' : 'gray'}
                  >
                    {text.length}
                    {` / ${translations[app_lang].INPUT_MAX_LENGTH}`}
                  </Text>
                </Flex>
                <Text
                  style={{
                    fontWeight: '600',
                  }}
                  size={'lg'}
                  mb={4}
                >
                  Upload Text File
                </Text>
                <Text
                  style={{
                    color: 'hsla(240, 4%, 58%, 1)',
                    fontWeight: '400',
                  }}
                  mb={12}
                >
                  {translations[app_lang].UPLOAD_TEXT_FILE_DESCRIPTION}
                </Text>
                <Box
                  style={{
                    border:
                      '1px solid ' +
                      (app_theme === 'dark' ? '#2f2e2e' : '#CDCDCDFF'),
                    borderRadius: '24px',
                    padding: '3px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  mx={{
                    base: 'auto',
                    md: 0,
                    lg: 0,
                  }}
                  // miw={350}
                  // maw={300}
                  mb={24}
                >
                  <FileButton
                    accept=".txt"
                    onChange={(file) => {
                      setTextFile(file);
                    }}
                  >
                    {(props) => (
                      <Button
                        {...props}
                        size="sm"
                        style={{
                          borderRadius: '24px',
                          zIndex: 1,
                          // padding: '0px',
                          color: app_theme === 'dark' ? '#CDCDCDFF' : '#141415',
                          backgroundColor:
                            app_theme === 'dark' ? '#141415' : '#EDEDEE',
                        }}
                        w={'120px'}
                      >
                        {translations[app_lang].UPLOAD_TEXT_FILE_BUTTON}
                      </Button>
                    )}
                  </FileButton>
                  <FileInput
                    accept=".flac,.mp3,.mp4,.mpeg,.mpga,.m4a,.ogg,.wav,.webm"
                    value={speechFile}
                    onChange={(file) => {
                      setSpeechFile(file);
                    }}
                    w={'100%'}
                    style={{
                      border: 'none',
                    }}
                    styles={(theme) => ({
                      input: {
                        border: 'none',
                        backgroundColor: 'transparent',
                      },
                      placeholder: {
                        paddingLeft: '5%',
                      },
                    })}
                    placeholder={translations[app_lang].UPLOAD_FILE_PLACEHOLDER}
                    clearable
                  />
                </Box>
              </Box>
            </Grid.Col>
            <Grid.Col
              sx={() => ({
                // borderRight: '1px solid #D9D9D9',
                '@media (min-width: 768px)': {
                  display: 'flex',
                  justifyContent: 'flex-end',
                },
              })}
              sm={6}
              md={6}
              lg={6}
              w={'100%'}
              // mt={48}
              pr={{
                base: 8,
                sm: 8,
                md: 60,
                lg: 60,
              }}
              pl={{
                base: 8,
                sm: 8,
                md: 24,
                lg: 24,
              }}
              mx={'auto'}
            >
              <Box w={'100%'}>
                <Text size={'lg'} weight={600}>
                  {translations[app_lang].AUDIO_OPTION}
                </Text>
                <Group my={8}>
                  <Box
                    style={{
                      backgroundColor:
                        app_theme === 'dark'
                          ? audioOption === 'alloy'
                            ? 'hsla(240, 4%, 18%, 1)'
                            : 'transparent'
                          : audioOption === 'alloy'
                          ? 'hsla(240, 5%, 88%, 1)'
                          : 'transparent',
                      padding: '4px 7px',
                      borderRadius: '8px',
                      border:
                        '1px solid ' +
                        (app_theme === 'dark'
                          ? 'hsla(240, 4%, 18%, 1)'
                          : 'hsla(240, 5%, 88%, 1)'),
                      cursor: 'pointer',
                    }}
                    onClick={() => setAudioOption('alloy')}
                  >
                    Alloy
                  </Box>
                  <Box
                    style={{
                      backgroundColor:
                        app_theme === 'dark'
                          ? audioOption === 'echo'
                            ? 'hsla(240, 4%, 18%, 1)'
                            : 'transparent'
                          : audioOption === 'echo'
                          ? 'hsla(240, 5%, 88%, 1)'
                          : 'transparent',
                      padding: '4px 7px',
                      borderRadius: '8px',
                      border:
                        '1px solid ' +
                        (app_theme === 'dark'
                          ? 'hsla(240, 4%, 18%, 1)'
                          : 'hsla(240, 5%, 88%, 1)'),
                      cursor: 'pointer',
                    }}
                    onClick={() => setAudioOption('echo')}
                  >
                    Echo
                  </Box>
                  <Box
                    style={{
                      backgroundColor:
                        app_theme === 'dark'
                          ? audioOption === 'fable'
                            ? 'hsla(240, 4%, 18%, 1)'
                            : 'transparent'
                          : audioOption === 'fable'
                          ? 'hsla(240, 5%, 88%, 1)'
                          : 'transparent',
                      padding: '4px 7px',
                      borderRadius: '8px',
                      border:
                        '1px solid ' +
                        (app_theme === 'dark'
                          ? 'hsla(240, 4%, 18%, 1)'
                          : 'hsla(240, 5%, 88%, 1)'),
                      cursor: 'pointer',
                    }}
                    onClick={() => setAudioOption('fable')}
                  >
                    Fable
                  </Box>
                  <Box
                    style={{
                      backgroundColor:
                        app_theme === 'dark'
                          ? audioOption === 'onyx'
                            ? 'hsla(240, 4%, 18%, 1)'
                            : 'transparent'
                          : audioOption === 'onyx'
                          ? 'hsla(240, 5%, 88%, 1)'
                          : 'transparent',
                      padding: '4px 7px',
                      borderRadius: '8px',
                      border:
                        '1px solid ' +
                        (app_theme === 'dark'
                          ? 'hsla(240, 4%, 18%, 1)'
                          : 'hsla(240, 5%, 88%, 1)'),
                      cursor: 'pointer',
                    }}
                    onClick={() => setAudioOption('onyx')}
                  >
                    Onyx
                  </Box>
                  <Box
                    style={{
                      backgroundColor:
                        app_theme === 'dark'
                          ? audioOption === 'nova'
                            ? 'hsla(240, 4%, 18%, 1)'
                            : 'transparent'
                          : audioOption === 'nova'
                          ? 'hsla(240, 5%, 88%, 1)'
                          : 'transparent',
                      padding: '4px 7px',
                      borderRadius: '8px',
                      border:
                        '1px solid ' +
                        (app_theme === 'dark'
                          ? 'hsla(240, 4%, 18%, 1)'
                          : 'hsla(240, 5%, 88%, 1)'),
                      cursor: 'pointer',
                    }}
                    onClick={() => setAudioOption('nova')}
                  >
                    Nova
                  </Box>
                  <Box
                    style={{
                      backgroundColor:
                        app_theme === 'dark'
                          ? audioOption === 'shimmer'
                            ? 'hsla(240, 4%, 18%, 1)'
                            : 'transparent'
                          : audioOption === 'shimmer'
                          ? 'hsla(240, 5%, 88%, 1)'
                          : 'transparent',
                      padding: '4px 7px',
                      borderRadius: '8px',
                      border:
                        '1px solid ' +
                        (app_theme === 'dark'
                          ? 'hsla(240, 4%, 18%, 1)'
                          : 'hsla(240, 5%, 88%, 1)'),
                      cursor: 'pointer',
                    }}
                    onClick={() => setAudioOption('shimmer')}
                  >
                    Shimmer
                  </Box>
                </Group>
                <Text size={'sm'} weight={700} mt={16}>
                  {translations[app_lang].AUDIO_FORMAT}
                </Text>
                <Group my={8} align="center">
                  <Box
                    style={{
                      backgroundColor:
                        app_theme === 'dark'
                          ? audioFormat === 'mp3'
                            ? 'hsla(240, 4%, 18%, 1)'
                            : 'transparent'
                          : audioFormat === 'mp3'
                          ? 'hsla(240, 5%, 88%, 1)'
                          : 'transparent',
                      padding: '4px 7px',
                      borderRadius: '8px',
                      border:
                        '1px solid ' +
                        (app_theme === 'dark'
                          ? 'hsla(240, 4%, 18%, 1)'
                          : 'hsla(240, 5%, 88%, 1)'),
                      cursor: 'pointer',
                    }}
                    onClick={() => setAudioFormat('mp3')}
                  >
                    MP3
                  </Box>
                  <Box
                    style={{
                      backgroundColor:
                        app_theme === 'dark'
                          ? audioFormat === 'opus'
                            ? 'hsla(240, 4%, 18%, 1)'
                            : 'transparent'
                          : audioFormat === 'opus'
                          ? 'hsla(240, 5%, 88%, 1)'
                          : 'transparent',
                      padding: '4px 7px',
                      borderRadius: '8px',
                      border:
                        '1px solid ' +
                        (app_theme === 'dark'
                          ? 'hsla(240, 4%, 18%, 1)'
                          : 'hsla(240, 5%, 88%, 1)'),
                      cursor: 'pointer',
                    }}
                    onClick={() => setAudioFormat('opus')}
                  >
                    Opus
                  </Box>
                  <Box
                    style={{
                      backgroundColor:
                        app_theme === 'dark'
                          ? audioFormat === 'aac'
                            ? 'hsla(240, 4%, 18%, 1)'
                            : 'transparent'
                          : audioFormat === 'aac'
                          ? 'hsla(240, 5%, 88%, 1)'
                          : 'transparent',
                      padding: '4px 7px',
                      borderRadius: '8px',
                      border:
                        '1px solid ' +
                        (app_theme === 'dark'
                          ? 'hsla(240, 4%, 18%, 1)'
                          : 'hsla(240, 5%, 88%, 1)'),
                      cursor: 'pointer',
                    }}
                    onClick={() => setAudioFormat('aac')}
                  >
                    AAC
                  </Box>
                  <Box
                    style={{
                      backgroundColor:
                        app_theme === 'dark'
                          ? audioFormat === 'flac'
                            ? 'hsla(240, 4%, 18%, 1)'
                            : 'transparent'
                          : audioFormat === 'flac'
                          ? 'hsla(240, 5%, 88%, 1)'
                          : 'transparent',
                      padding: '4px 7px',
                      borderRadius: '8px',
                      border:
                        '1px solid ' +
                        (app_theme === 'dark'
                          ? 'hsla(240, 4%, 18%, 1)'
                          : 'hsla(240, 5%, 88%, 1)'),
                      cursor: 'pointer',
                    }}
                    onClick={() => setAudioFormat('flac')}
                  >
                    FLAC
                  </Box>
                </Group>
                <Text size={'sm'} weight={700} mt={16}>
                  {translations[app_lang].AUDIO_SPEED}
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
                  color="dark"
                  styles={{
                    bar: {
                      backgroundColor: app_theme === 'dark' ? '#fff' : '#000',
                    },
                    thumb: {
                      backgroundColor: app_theme !== 'dark' ? '#fff' : '#000',
                      border: '2px solid',
                      height: '20px',
                      width: '20px',
                    },
                  }}
                  my={32}
                />
                <Box mt={48}>
                  <StyledButton
                    icon={<IconRefresh />}
                    app_theme={app_theme}
                    loading={loading}
                    disabled={text.length === 0}
                    handleConvert={handleTextToSpeech}
                    button_label={translations[app_lang].CONVERT_TO_SPEECH}
                  />
                </Box>

                {/* <Button
                  mt={16}
                  color="gray"
                  variant="light"
                  style={{
                    border: '1px solid',
                  }}
                  fullWidth
                  onClick={handleDownload}
                  disabled={!speechFile}
                >
                  Download
                </Button> */}

                {speechFile && (
                  <Flex my={12} direction={'column'} gap={24}>
                    <Divider my={24} />
                    <AudioPlayer
                      audioUrl={
                        speechFile ? URL.createObjectURL(speechFile) : ''
                      }
                      theme={app_theme}
                      handleDelete={() => setSpeechFile(null)}
                    />
                    <StyledButton
                      app_theme={app_theme}
                      loading={false}
                      disabled={!speechFile}
                      handleConvert={handleDownload}
                      button_label={translations[app_lang].DOWNLOAD}
                      icon={<IconDownload />}
                    />
                  </Flex>
                )}
              </Box>
            </Grid.Col>
          </Grid>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
};

export default Home;

const translations = {
  en: {
    INPUT_LABEL: 'Type/Paste your text here',
    INPUT_PLACEHOLDER: 'Welcome to Microapp.io',
    INPUT_MAX_LENGTH: '500 characters',
    UPLOAD_TEXT_FILE: 'Upload Text File',
    UPLOAD_TEXT_FILE_DESCRIPTION:
      'Upload a text file (.txt) to convert it to speech',
    UPLOAD_TEXT_FILE_BUTTON: 'Browse',
    UPLOAD_FILE_PLACEHOLDER: 'No file selected',
    AUDIO_OPTION: 'Audio Option',
    AUDIO_FORMAT: 'Audio Format',
    AUDIO_SPEED: 'Audio Speed',
    CONVERT_TO_SPEECH: 'Convert to Speech',
    DOWNLOAD: 'Download',
  },
  es: {
    INPUT_LABEL: 'Escribe/Pega tu texto aquí',
    INPUT_PLACEHOLDER: 'Bienvenido a Microapp.io',
    INPUT_MAX_LENGTH: '500 caracteres',
    UPLOAD_TEXT_FILE: 'Subir archivo de texto',
    UPLOAD_TEXT_FILE_DESCRIPTION:
      'Sube un archivo de texto (.txt) para convertirlo en voz',
    UPLOAD_TEXT_FILE_BUTTON: 'Examinar',
    UPLOAD_FILE_PLACEHOLDER: 'Ningún archivo seleccionado',
    AUDIO_OPTION: 'Opción de audio',
    AUDIO_FORMAT: 'Formato de audio',
    AUDIO_SPEED: 'Velocidad del audio',
    CONVERT_TO_SPEECH: 'Convertir a voz',
    DOWNLOAD: 'Descargar',
  },
  pt: {
    INPUT_LABEL: 'Digite/Cole seu texto aqui',
    INPUT_PLACEHOLDER: 'Bem-vindo ao Microapp.io',
    INPUT_MAX_LENGTH: '500 caracteres',
    UPLOAD_TEXT_FILE: 'Enviar arquivo de texto',
    UPLOAD_TEXT_FILE_DESCRIPTION:
      'Envie um arquivo de texto (.txt) para convertê-lo em voz',
    UPLOAD_TEXT_FILE_BUTTON: 'Procurar',
    UPLOAD_FILE_PLACEHOLDER: 'Nenhum arquivo selecionado',
    AUDIO_OPTION: 'Opção de áudio',
    AUDIO_FORMAT: 'Formato de áudio',
    AUDIO_SPEED: 'Velocidade do áudio',
    CONVERT_TO_SPEECH: 'Converter para voz',
    DOWNLOAD: 'Baixar',
  },
};
