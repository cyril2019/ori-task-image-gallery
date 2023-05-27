import {
  Box,
  CircularProgress,
  ImageList,
  ImageListItem,
  Modal,
} from "@mui/material";
import React from "react";
import { useGetImages } from "../Hooks/useGetImages";

// The modal that pops up when an image is clicked.
const ImageModal = (props) => {
  // item is the image object, modal is the boolean to show or hide the modal, setModal is the function to set the modal boolean.
  const { item, modal, setModal } = props;

  // loader is the boolean to show or hide the loader.
  const [loader, setLoader] = React.useState(true);
  return (
    <Modal
      open={modal}
      onClose={() => {
        setModal(false);
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          height: "100vh",
        }}
        onClick={() => {
          setModal(false);
        }}
      >
        {/* Loader when image is loading */}
        {loader && (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              paddingBlock: "20px",
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <img
          src={`${item.img}`}
          alt={item.title}
          loading="eager"
          style={{ maxHeight: "100vh" }}
          onLoad={() => {
            setLoader(false);
          }}
        />
      </Box>
    </Modal>
  );
};

const ImageGrid = (props) => {
  // query is the search term.
  const { query } = props;

  // currPage is the current page number.
  const [currPage, setCurrPage] = React.useState(1);

  // images is the array of image objects, isLoading is the boolean to show or hide the loader, error is the error object.
  // useGetImages is a custom hook that fetches images from the API.
  const [images, isLoading, error] = useGetImages(query, currPage, setCurrPage);
  const [modal, setModal] = React.useState(false);
  const [item, setItem] = React.useState(null);

  const observer = React.useRef();

  const lastElementRef = React.useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setCurrPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    // eslint-disable-next-line
    [isLoading]
  );

  return (
    <div>
      {/* MUI component to display images in a grid. */}
      <ImageList
        sx={{ width: "100%" }}
        variant="quilted"
        cols={3}
        rowHeight={400}
      >
        {images.map((item, index) => {
          // Checking last Image to add a reference to that image. Used for infinite scrolling.
          if (index === images.length - 1) {
            return (
              <ImageListItem key={index}>
                <img
                  src={`${item.img}?w=200&h=200&fit=crop&auto=format`}
                  alt={item.title}
                  loading="lazy"
                  ref={lastElementRef}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setItem(item);
                    setModal(true);
                  }}
                />
              </ImageListItem>
            );
          } else {
            // All other images.
            return (
              <ImageListItem key={index}>
                <img
                  src={`${item.img}?w=200&h=200&fit=crop&auto=format`}
                  alt={item.title}
                  loading="lazy"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setItem(item);
                    setModal(true);
                  }}
                />
              </ImageListItem>
            );
          }
        })}
      </ImageList>

      {/* The modal that pops up when an image is clicked. */}
      {modal && <ImageModal item={item} modal={modal} setModal={setModal} />}

      {/* Loader when images are loading */}
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            paddingBlock: "20px",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* No results found */}
      {images.length === 0 && !isLoading && (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            paddingBlock: "20px",
          }}
        >
          No Results Found
        </Box>
      )}

      {/* Error */}
      {error && (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            paddingBlock: "20px",
          }}
        >
          {`An Error Occured :(`}
        </Box>
      )}
    </div>
  );
};

export default ImageGrid;
