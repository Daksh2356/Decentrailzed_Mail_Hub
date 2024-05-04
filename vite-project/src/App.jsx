import { useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [cid, setCid] = useState(null);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files);
  };

  const handleSubmission = async () => {
    try {
      const formData = new FormData();
      Array.from(selectedFile).forEach((file) => {
        formData.append("file", file);
        // including nname of file in metadata
        formData.append("pinataMetadata", JSON.stringify({ name: file.name }));
      });

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );
      const resData = await res.json();
      setCid(resData.IpfsHash);
      console.log(resData.IpfsHash);
      console.log(formData);
      console.log("response: ", resData);
      console.log(`${import.meta.env.VITE_GATEWAY_URL}/ipfs/${cid}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="form-container">
        <div className="input_area">
          <label htmlFor="ipfsFile" className="form-label">
            Choose File :{" "}
          </label>
          <input
            type="file"
            onChange={changeHandler}
            multiple
            id="ipfsFile"
            accept=".jpg, .jpeg, .png, .gif"
          />
          <button onClick={handleSubmission}>Submit</button>
        </div>

        {cid && (
          <div className="image_area">
            <img
              src={`${import.meta.env.VITE_GATEWAY_URL}/ipfs/${cid}`}
              alt="ipfs image"
              height={200}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
