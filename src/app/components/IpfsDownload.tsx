import Link from "next/link";
import useIPFS from "../hooks/useIPFS";

interface IFPSProps {
  hash: string;
  filename: string;
}

export default function IPFSDownload({ hash, filename }: IFPSProps) {
  const file = useIPFS(hash, filename);
  return (
    <div>
      {file ? (
        <div className="download-component">
          <Link className="download-button" href={file} download={filename}>
            Download
          </Link>
        </div>
      ) : (
        <p>Fazendo download do arquivo...</p>
      )}
    </div>
  );
}
