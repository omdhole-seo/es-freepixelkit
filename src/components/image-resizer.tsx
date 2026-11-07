"use client";

import Image from "next/image";
import {
  Check,
  Download,
  ImagePlus,
  Info,
  Link2,
  LoaderCircle,
  LockKeyhole,
  RotateCcw,
  Upload,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

const INPUT_FORMATS = ["image/jpeg", "image/png", "image/webp"] as const;
const OUTPUT_FORMATS = [
  { mime: "image/jpeg", label: "JPEG", extension: "jpg" },
  { mime: "image/png", label: "PNG", extension: "png" },
  { mime: "image/webp", label: "WebP", extension: "webp" },
] as const;

type OutputFormat = (typeof OUTPUT_FORMATS)[number]["mime"];
type Dimensions = { width: number; height: number };
type Result = Dimensions & {
  format: OutputFormat;
  size: number;
  filename: string;
};

const MAX_DIMENSION = 12_000;
const MAX_PIXELS = 100_000_000;

function isInputFormat(value: string): value is (typeof INPUT_FORMATS)[number] {
  return INPUT_FORMATS.some((format) => format === value);
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<Dimensions | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [keepRatio, setKeepRatio] = useState(true);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/png");
  const [supportedFormats, setSupportedFormats] = useState<OutputFormat[]>([]);
  const [formatsChecked, setFormatsChecked] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let cancelled = false;
    const canvas = document.createElement("canvas");

    async function checkFormats() {
      const available: OutputFormat[] = [];

      for (const format of OUTPUT_FORMATS) {
        const supported = await new Promise<boolean>((resolve) => {
          canvas.toBlob(
            (blob) => resolve(blob?.type === format.mime),
            format.mime,
          );
        });
        if (supported) available.push(format.mime);
      }

      if (!cancelled) {
        setSupportedFormats(available);
        setFormatsChecked(true);
        setOutputFormat((current) =>
          available.includes(current) ? current : (available[0] ?? "image/png"),
        );
      }
    }

    void checkFormats();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(
    () => () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    },
    [sourceUrl],
  );

  useEffect(
    () => () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    },
    [resultUrl],
  );

  function acceptFile(nextFile: File | undefined) {
    setError(null);
    setResultUrl(null);
    setResult(null);

    if (!nextFile) return;
    if (!isInputFormat(nextFile.type)) {
      setError("Formato no compatible. Selecciona una imagen JPEG, PNG o WebP.");
      return;
    }
    if (nextFile.size === 0) {
      setError("El archivo está vacío. Elige otra imagen.");
      return;
    }

    setFile(nextFile);
    setSourceUrl(URL.createObjectURL(nextFile));
    setNaturalSize(null);
    setImageReady(false);
    setWidth("");
    setHeight("");
    setOutputFormat((current) => {
      const sourceFormat = supportedFormats.find(
        (format) => format === nextFile.type,
      );
      if (sourceFormat) return sourceFormat;
      return supportedFormats.includes(current)
        ? current
        : (supportedFormats[0] ?? "image/png");
    });
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    acceptFile(event.currentTarget.files?.[0]);
    event.currentTarget.value = "";
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    acceptFile(event.dataTransfer.files[0]);
  }

  function updateWidth(value: string) {
    setWidth(value);
    if (keepRatio && naturalSize && value) {
      const nextWidth = Number(value);
      if (Number.isFinite(nextWidth) && nextWidth > 0) {
        setHeight(
          String(Math.max(1, Math.round(nextWidth / (naturalSize.width / naturalSize.height)))),
        );
      }
    }
  }

  function updateHeight(value: string) {
    setHeight(value);
    if (keepRatio && naturalSize && value) {
      const nextHeight = Number(value);
      if (Number.isFinite(nextHeight) && nextHeight > 0) {
        setWidth(
          String(Math.max(1, Math.round(nextHeight * (naturalSize.width / naturalSize.height)))),
        );
      }
    }
  }

  function applyPreset(scale: number) {
    if (!naturalSize) return;
    setWidth(String(Math.max(1, Math.round(naturalSize.width * scale))));
    setHeight(String(Math.max(1, Math.round(naturalSize.height * scale))));
  }

  function reset() {
    setFile(null);
    setSourceUrl(null);
    setResultUrl(null);
    setNaturalSize(null);
    setWidth("");
    setHeight("");
    setKeepRatio(true);
    setOutputFormat(
      supportedFormats.includes("image/png")
        ? "image/png"
        : (supportedFormats[0] ?? "image/png"),
    );
    setImageReady(false);
    setProcessing(false);
    setError(null);
    setResult(null);
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleImageLoad() {
    const image = imageRef.current;
    if (!image) return;

    const dimensions = {
      width: image.naturalWidth,
      height: image.naturalHeight,
    };
    if (!dimensions.width || !dimensions.height) {
      setError("No se pudieron leer las dimensiones de esta imagen.");
      return;
    }

    setNaturalSize(dimensions);
    setWidth(String(dimensions.width));
    setHeight(String(dimensions.height));
    setImageReady(true);
    setError(null);
  }

  function handleImageError() {
    setImageReady(false);
    setError(
      "No se pudo abrir esta imagen en el navegador. Prueba con un archivo JPEG, PNG o WebP válido.",
    );
  }

  async function resizeImage() {
    setError(null);
    setResultUrl(null);
    setResult(null);

    if (!file || !imageReady || !naturalSize || !imageRef.current) {
      setError("Selecciona una imagen válida antes de redimensionarla.");
      return;
    }
    if (!formatsChecked || supportedFormats.length === 0) {
      setError("Este navegador no admite la exportación de imágenes con Canvas.");
      return;
    }

    const targetWidth = Number(width);
    const targetHeight = Number(height);
    if (
      !Number.isInteger(targetWidth) ||
      !Number.isInteger(targetHeight) ||
      targetWidth < 1 ||
      targetHeight < 1
    ) {
      setError("Introduce un ancho y un alto enteros mayores que cero.");
      return;
    }
    if (targetWidth > MAX_DIMENSION || targetHeight > MAX_DIMENSION) {
      setError(`Cada dimensión debe ser de ${MAX_DIMENSION.toLocaleString("es")} px o menos.`);
      return;
    }
    if (targetWidth * targetHeight > MAX_PIXELS) {
      setError("La imagen de salida es demasiado grande. Reduce sus dimensiones.");
      return;
    }
    if (!supportedFormats.includes(outputFormat)) {
      setError("El formato elegido no está disponible en este navegador.");
      return;
    }

    setProcessing(true);
    const canvas = document.createElement("canvas");

    try {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("No se pudo iniciar el procesamiento de la imagen.");
      }

      if (outputFormat === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, targetWidth, targetHeight);
      }

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(imageRef.current, 0, 0, targetWidth, targetHeight);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (output) => {
            if (!output) {
              reject(new Error("No se pudo crear el archivo de salida."));
            } else if (output.type !== outputFormat) {
              reject(
                new Error(
                  "El navegador no pudo exportar el formato seleccionado. Elige otro formato.",
                ),
              );
            } else {
              resolve(output);
            }
          },
          outputFormat,
          outputFormat === "image/png" ? undefined : 0.92,
        );
      });

      const format = OUTPUT_FORMATS.find((item) => item.mime === outputFormat);
      if (!format) {
        throw new Error("El formato de salida seleccionado no es válido.");
      }

      const baseName = file.name.replace(/\.[^.]+$/, "") || "imagen";
      setResult({
        width: targetWidth,
        height: targetHeight,
        format: outputFormat,
        size: blob.size,
        filename: `${baseName}-redimensionada.${format.extension}`,
      });
      setResultUrl(URL.createObjectURL(blob));
    } catch (processingError) {
      setError(
        processingError instanceof Error
          ? processingError.message
          : "No se pudo redimensionar la imagen. Inténtalo de nuevo.",
      );
    } finally {
      canvas.width = 0;
      canvas.height = 0;
      setProcessing(false);
    }
  }

  const formatLabel = (mime: OutputFormat) =>
    OUTPUT_FORMATS.find((format) => format.mime === mime)?.label ?? mime;

  return (
    <section className="resizer" aria-label="Redimensionador de imagen">
      <div className="resizer__panel resizer__upload-panel">
        <div className="resizer__panel-heading">
          <div>
            <h2>Tu imagen</h2>
            <p>Elige un archivo para ver y ajustar sus dimensiones.</p>
          </div>
          <span className="resizer__local-badge">
            <LockKeyhole size={12} aria-hidden="true" />
            Procesamiento local
          </span>
        </div>

        <label
          className={`dropzone${isDragging ? " dropzone--active" : ""}`}
          htmlFor="resizer-file"
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            accept={INPUT_FORMATS.join(",")}
            className="dropzone__input"
            id="resizer-file"
            onChange={handleFileChange}
            ref={fileInputRef}
            type="file"
          />
          {sourceUrl && file ? (
            <>
              <span className="dropzone__preview">
                <Image
                  alt={`Vista previa de ${file.name}`}
                  fill
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  ref={imageRef}
                  sizes="(max-width: 760px) 90vw, 44vw"
                  src={sourceUrl}
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              </span>
              <span className="dropzone__filename" title={file.name}>
                {file.name}
              </span>
              <span className="dropzone__dimensions">
                {naturalSize
                  ? `${naturalSize.width} × ${naturalSize.height} px · ${formatBytes(file.size)}`
                  : "Leyendo dimensiones…"}
              </span>
            </>
          ) : (
            <>
              <span className="dropzone__icon" aria-hidden="true">
                <ImagePlus size={24} />
              </span>
              <h3>Arrastra y suelta tu imagen aquí</h3>
              <p className="dropzone__hint">o selecciona un archivo de tu dispositivo</p>
              <span className="dropzone__button">
                <Upload size={15} aria-hidden="true" />
                Seleccionar imagen
              </span>
              <p className="dropzone__formats">Formatos admitidos: JPEG, PNG y WebP</p>
            </>
          )}
        </label>
      </div>

      <div className="resizer__panel resizer__settings-panel">
        <div className="resizer__panel-heading">
          <div>
            <h2>Dimensiones de salida</h2>
            <p>Elige el tamaño y el formato que necesitas.</p>
          </div>
        </div>

        <div className="settings-group">
          <div className="settings-group__heading">
            <span>Dimensiones</span>
            <span>Máximo 12.000 px por lado</span>
          </div>
          <div className="dimension-fields">
            <label className="dimension-field" htmlFor="resizer-width">
              Ancho (px)
              <input
                disabled={!imageReady}
                id="resizer-width"
                inputMode="numeric"
                max={MAX_DIMENSION}
                min={1}
                onChange={(event) => updateWidth(event.target.value)}
                step={1}
                type="number"
                value={width}
              />
            </label>
            <span className="dimension-fields__separator" aria-hidden="true">
              ×
            </span>
            <label className="dimension-field" htmlFor="resizer-height">
              Alto (px)
              <input
                disabled={!imageReady}
                id="resizer-height"
                inputMode="numeric"
                max={MAX_DIMENSION}
                min={1}
                onChange={(event) => updateHeight(event.target.value)}
                step={1}
                type="number"
                value={height}
              />
            </label>
          </div>
          <label className="aspect-toggle" htmlFor="keep-ratio">
            <input
              checked={keepRatio}
              disabled={!imageReady}
              id="keep-ratio"
              onChange={(event) => {
                const nextValue = event.target.checked;
                setKeepRatio(nextValue);
                if (nextValue && naturalSize) {
                  const currentWidth = Number(width);
                  if (Number.isFinite(currentWidth) && currentWidth > 0) {
                    setHeight(
                      String(
                        Math.max(
                          1,
                          Math.round(
                            currentWidth /
                              (naturalSize.width / naturalSize.height),
                          ),
                        ),
                      ),
                    );
                  }
                }
              }}
              type="checkbox"
            />
            <Link2 size={14} aria-hidden="true" />
            Mantener la proporción
          </label>
          <div className="preset-buttons" aria-label="Tamaños preestablecidos">
            {[
              { label: "50 %", scale: 0.5 },
              { label: "75 %", scale: 0.75 },
              { label: "Original", scale: 1 },
            ].map((preset) => (
              <button
                className="preset-button"
                disabled={!imageReady}
                key={preset.label}
                onClick={() => applyPreset(preset.scale)}
                type="button"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-group">
          <label className="settings-group__heading" htmlFor="output-format">
            <span>Formato de salida</span>
            {!formatsChecked ? <span>Comprobando compatibilidad…</span> : null}
          </label>
          <select
            className="format-select"
            disabled={!formatsChecked || supportedFormats.length === 0}
            id="output-format"
            onChange={(event) => {
              const nextFormat = supportedFormats.find(
                (format) => format === event.target.value,
              );
              if (nextFormat) setOutputFormat(nextFormat);
            }}
            value={outputFormat}
          >
            {supportedFormats.map((format) => (
              <option key={format} value={format}>
                {formatLabel(format)}
              </option>
            ))}
          </select>
          <p className="settings-note">
            <Info size={13} aria-hidden="true" />
            JPEG no conserva la transparencia: las zonas transparentes se
            mostrarán en blanco.
          </p>
        </div>

        <div className="resizer__actions">
          <button
            className="button button--primary"
            disabled={!imageReady || processing || supportedFormats.length === 0}
            onClick={resizeImage}
            type="button"
          >
            {processing ? (
              <>
                <LoaderCircle size={17} className="spinner" aria-hidden="true" />
                Procesando imagen…
              </>
            ) : (
              <>
                <ImagePlus size={17} aria-hidden="true" />
                Redimensionar imagen
              </>
            )}
          </button>
          <button className="resizer__reset" onClick={reset} type="button">
            <RotateCcw size={14} aria-hidden="true" />
            Restablecer
          </button>
        </div>

        {error ? (
          <p className="resizer__error" role="alert">
            {error}
          </p>
        ) : null}

        {result && resultUrl ? (
          <div className="resizer__success" aria-live="polite">
            <div className="resizer__success-heading">
              <Check size={16} aria-hidden="true" />
              Imagen lista para descargar
            </div>
            <p className="resizer__success-meta">
              {result.width} × {result.height} px · {formatLabel(result.format)} ·{" "}
              {formatBytes(result.size)}
            </p>
            <div className="resizer__result-preview">
              <Image
                alt="Vista previa de la imagen redimensionada"
                fill
                sizes="(max-width: 760px) 90vw, 35vw"
                src={resultUrl}
                style={{ objectFit: "contain" }}
                unoptimized
              />
            </div>
            <a
              className="resizer__download"
              download={result.filename}
              href={resultUrl}
            >
              <Download size={15} aria-hidden="true" />
              Descargar imagen
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
