// Import necessary dependencies
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  ListGroup,
} from "react-bootstrap";
import EXIF from "exif-js"; // This is to handle EXIF data
import piexif from "piexifjs";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { arrayBufferToBinaryString } from "blob-util";

// UploadComponent is a component that allows users to select multiple files
// from their file system. When files are selected, it updates the 'files'
// state in the parent component.
const UploadComponent = ({ setFiles }) => {
  const handleChange = (event) => {
    event.persist();
    if (event.target.files.length) {
      setFiles(Array.from(event.target.files));
    }
  };

  return (
    <Form>
      <Form.Group>
        <Form.Control
          type="file"
          id="image-upload"
          onChange={handleChange}
          multiple
        />
      </Form.Group>
    </Form>
  );
};

// MetadataDisplayComponent is a component that takes a file as a prop and
// displays its EXIF data. EXIF data is metadata that can include things
// like camera settings, location data, and more.
const MetadataDisplayComponent = ({ file }) => {
  const [exifData, setExifData] = useState(null);

  // Use EXIF.js to extract EXIF data
  useEffect(() => {
    if (file) {
      EXIF.getData(file, function () {
        const allMetaData = EXIF.getAllTags(this);
        setExifData(allMetaData);
      });
    }
  }, [file]);

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Header>EXIF Data</Card.Header>
      <ListGroup variant="flush">
        {exifData &&
          Object.keys(exifData).map((key, index) => (
            <ListGroup.Item
              key={index}
            >{`${key}: ${exifData[key]}`}</ListGroup.Item>
          ))}
      </ListGroup>
    </Card>
  );
};

// ImagePreviewComponent is a component that takes a file and a function to
// handle file removal as props. It displays a preview of the image and a button
// to remove the image. When the button is clicked, it calls the handleRemove
// function with the file as an argument.
const ImagePreviewComponent = ({ file, handleRemove }) => {
    const [src, setSrc] = useState("");

    // Create a URL for the image
    useEffect(() => {
        let reader = new FileReader();
        reader.onloadend = function (e) {
            const arrayBuffer = e.target.result;
            const binaryString = arrayBufferToBinaryString(arrayBuffer);
            setSrc(binaryString);
        };
        if (file) {
            reader.readAsArrayBuffer(file);
        }
    }, [file]); // this effect will run again if the `file` prop changes

    return (
        <div>
            <img src={`data:image/jpeg;base64,${btoa(src)}`} alt="preview" />
            <button onClick={() => handleRemove(file)}>X</button>
        </div>
    );
};

// DownloadComponent is a component that takes an array of files as a prop.
// It includes a button that, when clicked, creates a zip file of the images
// with all EXIF data removed. It then prompts the user to download the zip file.
const DownloadComponent = ({ files }) => {
  const handleDownload = async () => {
    let zip = new JSZip();

    // Use Promise.all to ensure all files are processed before creating the zip file
    try {
      await Promise.all(
        files.map(
          (file, index) =>
            new Promise((resolve, reject) => {
              // Check if the file type is JPEG
              if (file.type !== "image/jpeg") {
                reject(new Error(`File ${file.name} is not a JPEG image`));
                return;
              }

              let reader = new FileReader();

              reader.onloadend = function (e) {
                // Get the image data as a binary string
                let data = arrayBufferToBinaryString(e.target.result);

                // Remove the EXIF data
                let zeroth = {};
                let exif = {};
                let gps = {};
                let thumbnail = null;
                let exifObj = {
                  "0th": zeroth,
                  Exif: exif,
                  GPS: gps,
                  thumbnail: thumbnail,
                };
                let exifbytes = piexif.dump(exifObj);
                let newData = piexif.insert(exifbytes, data);

                // Create a new Blob from the modified image data
                let newBlob = new Blob(
                  [new Uint8Array([...newData].map((c) => c.charCodeAt(0)))],
                  { type: "image/jpeg" }
                );

                // Add the modified image to the zip file
                zip.file(`image-${index}.jpg`, newBlob);

                resolve();
              };

              reader.onerror = () =>
                reject(new Error(`Error reading file ${file.name}`));
              reader.readAsArrayBuffer(file);
            })
        )
      );
    } catch (error) {
      alert(error.message); // Display the error
      return; // Do not proceed with zip file generation
    }

    // Generate the zip file and prompt the user to download it
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "images.zip");
    });
  };

  return (
    <Button variant="primary" onClick={handleDownload}>
      Download Images
    </Button>
  );
};

// App Component
function App() {
  const [files, setFiles] = useState([]);

  const handleRemove = (fileToRemove) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center text-center">
        <Col md="8">
          <h1 className="header mb-4">Welcome To ExitExif</h1>
          <p className="lead">
            Privacy matters. In an age of advanced AI and machine learning,
            protecting your personal data is more important than ever.
          </p>
          <p className="lead">
            ExitExif helps you protect your privacy by removing potentially
            sensitive metadata from your images.
          </p>
          <Button
            variant="primary"
            href="https://github.com/d3r3nic/exitexif"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More
          </Button>
          <UploadComponent setFiles={setFiles} />
          {files.length > 0 &&
            files.map((file, index) => (
              <React.Fragment key={index}>
                <ImagePreviewComponent
                  file={file}
                  handleRemove={handleRemove}
                />
                <MetadataDisplayComponent file={file} />
                <DownloadComponent files={files} />
              </React.Fragment>
            ))}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
