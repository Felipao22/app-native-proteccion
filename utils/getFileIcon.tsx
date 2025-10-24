import { FileText, Image, Video, File, FolderOpen } from "lucide-react-native";

export const getFileIcon = (type: string) => {
  switch (type) {
    case "application/pdf":
      return <FileText size={24} color="#dc2626" />;
    case "excel":
      return <FileText size={24} color="#059669" />;
    case "word":
      return <FileText size={24} color="#1e40af" />;
    case "video":
      return <Video size={24} color="#7c3aed" />;
    case "image":
      return <Image size={24} color="#ea580c" />;
    case "zip":
      return <FolderOpen size={24} color="#64748b" />;
    default:
      return <File size={24} color="#64748b" />;
  }
};
