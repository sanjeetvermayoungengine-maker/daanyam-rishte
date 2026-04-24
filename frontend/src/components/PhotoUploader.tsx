import { useRef, useState, type DragEvent } from "react";
import { addPhoto, removePhoto, setPrimaryPhoto, type BioPhoto } from "../store/bioDataSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createLocalPhoto } from "../services/uploadService";

const allowedTypes = ["image/jpeg", "image/png"];
const maxBytes = 5 * 1024 * 1024;

export function PhotoUploader() {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const photos = useAppSelector((state) => state.bioData.photos);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const readFile = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      setError("Upload JPG or PNG photos only.");
      return;
    }

    if (file.size > maxBytes) {
      setError("Each photo must be smaller than 5MB.");
      return;
    }

    setError("");
    setProgress(25);

    const reader = new FileReader();
    reader.onload = () => {
      const photo = createLocalPhoto(file, String(reader.result));
      dispatch(addPhoto(photo));
      setProgress(100);
      window.setTimeout(() => setProgress(0), 700);
    };
    reader.onerror = () => {
      setError("Could not read this photo. Try a different file.");
      setProgress(0);
    };
    reader.readAsDataURL(file);
  };

  const handleFiles = (files: FileList | File[]) => {
    Array.from(files).slice(0, 6).forEach(readFile);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemove = (photo: BioPhoto) => {
    dispatch(removePhoto(photo.id));
  };

  return (
    <div className="photo-uploader">
      <div className="drop-zone" onDrop={handleDrop} onDragOver={handleDragOver}>
        <div className="drop-zone__icon" aria-hidden="true">
          +
        </div>
        <h3>Add profile photos</h3>
        <p>Drag photos here or choose JPG/PNG files up to 5MB each.</p>
        <button className="button button--primary" type="button" onClick={() => inputRef.current?.click()}>
          Choose Photos
        </button>
        <input
          ref={inputRef}
          className="visually-hidden"
          type="file"
          accept="image/png,image/jpeg"
          multiple
          onChange={(event) => {
            if (event.target.files) {
              handleFiles(event.target.files);
            }
          }}
        />
      </div>

      {progress > 0 ? (
        <div className="upload-progress" aria-label="Upload progress">
          <span style={{ width: `${progress}%` }} />
        </div>
      ) : null}

      {error ? <p className="field-error">{error}</p> : null}

      {photos.items.length ? (
        <div className="photo-grid">
          {photos.items.map((photo) => {
            const isPrimary = photo.id === photos.primaryPhotoId;

            return (
              <article className="photo-tile" key={photo.id}>
                <img src={photo.url} alt={photo.name} />
                <div className="photo-tile__actions">
                  <button
                    className={isPrimary ? "chip chip--active" : "chip"}
                    type="button"
                    onClick={() => dispatch(setPrimaryPhoto(photo.id))}
                  >
                    {isPrimary ? "Primary" : "Set primary"}
                  </button>
                  <button className="text-button" type="button" onClick={() => handleRemove(photo)}>
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
