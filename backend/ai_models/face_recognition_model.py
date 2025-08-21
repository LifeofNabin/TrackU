import cv2
import numpy as np
import face_recognition
from .model_utils import save_embeddings, load_embeddings

class FaceRecognitionModel:
    def __init__(self):
        self.known_face_encodings = []
        self.known_face_ids = []
        
    def load_existing_embeddings(self, embeddings_path):
        self.known_face_encodings, self.known_face_ids = load_embeddings(embeddings_path)
        
    def register_face(self, image_path, user_id, embeddings_path):
        image = face_recognition.load_image_file(image_path)
        face_encodings = face_recognition.face_encodings(image)
        
        if len(face_encodings) == 0:
            raise ValueError("No face detected in the image")
            
        self.known_face_encodings.append(face_encodings[0])
        self.known_face_ids.append(user_id)
        
        save_embeddings(embeddings_path, self.known_face_encodings, self.known_face_ids)
        return face_encodings[0].tolist()
        
    def recognize_face(self, image_path):
        unknown_image = face_recognition.load_image_file(image_path)
        face_locations = face_recognition.face_locations(unknown_image)
        face_encodings = face_recognition.face_encodings(unknown_image, face_locations)
        
        if not face_encodings:
            return None
            
        matches = face_recognition.compare_faces(self.known_face_encodings, face_encodings[0])
        face_distances = face_recognition.face_distance(self.known_face_encodings, face_encodings[0])
        best_match_index = np.argmin(face_distances)
        
        if matches[best_match_index]:
            return self.known_face_ids[best_match_index], float(face_distances[best_match_index])
            
        return None