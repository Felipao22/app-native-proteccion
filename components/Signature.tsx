import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import SignatureCanvas, { SignatureViewRef } from 'react-native-signature-canvas';

//Ocultar los botones internos del HTML. 
//Fondo transparente para exportar PNG sin fondo
const WEB_STYLE_HIDE_FOOTER = `
  body, html { background: transparent !important; }
  .m-signature-pad { display: flex; flex-direction: column; height: 100%; border: none; box-shadow: none; background: transparent !important; }
  .m-signature-pad--body { flex: 1; min-height: 0; height: auto !important; border: none; background: transparent !important; }
  .m-signature-pad--body canvas { background: transparent !important; }
  .m-signature-pad--footer { display: none !important; }
`;

type SignatureScreenProps = {
  onChange?: (dataUrl: string | null) => void;
  resetTrigger?: number;
  // Color del trazo
  penColor?: string;
  // Grosor mínimo de la línea. Por defecto 0.5
  minWidth?: number;
  //Grosor máximo al dibujar despacio. Por defecto 2.5
  maxWidth?: number;
};

const SignatureScreen = ({
  onChange,
  resetTrigger,
  penColor = '#000000',
  minWidth = 0.3,
  maxWidth = 1.5,
}: SignatureScreenProps) => {
  const [signature, setSignature] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [isEditingSignature, setIsEditingSignature] = useState(true);
  const [canvasKey, setCanvasKey] = useState(0);
  const ref = useRef<SignatureViewRef | null>(null);

  useEffect(() => {
    if (resetTrigger === undefined) return;
    ref.current?.clearSignature();
    setSignature(null);
    setShowActionButtons(false);
    setIsEditingSignature(true);
    setCanvasKey((k) => k + 1);
    onChange?.(null);
  }, [resetTrigger]);

  const handleSignature = (data: string) => {
    setSignature(data);
    setIsLoading(false);
    setIsEditingSignature(false);
    onChange?.(data);
  };

  const handleEmpty = () => {
    setIsLoading(false);
  };

  const handleClear = () => {
    setSignature(null);
    setShowActionButtons(false);
    onChange?.(null);
  };

  const handleError = (error: Error) => {
    console.error('Signature pad error:', error);
    setIsLoading(false);
  };

  const handlePressClear = () => {
    ref.current?.clearSignature();
  };

  const handlePressAccept = () => {
    if (!ref.current) return;
    setIsLoading(true);
    ref.current.readSignature();
  };

  const handlePressSignAgain = () => {
    setSignature(null);
    setShowActionButtons(false);
    setIsEditingSignature(true);
    setCanvasKey((k) => k + 1);
    onChange?.(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Firma</Text>
      {signature && (
        <View style={styles.preview}>
          <Image
            resizeMode="contain"
            style={styles.previewImage}
            source={{ uri: signature }}
          />
        </View>
      )}

      {!isEditingSignature && signature ? (
        <TouchableOpacity
          style={[styles.actionBtn, styles.signAgainBtn]}
          onPress={handlePressSignAgain}
          accessibilityRole="button"
          accessibilityLabel="Volver a firmar"
        >
          <Text style={styles.signAgainBtnText}>Volver a firmar</Text>
        </TouchableOpacity>
      ) : (
        <>
          <SignatureCanvas
            key={canvasKey}
            ref={ref}
            style={styles.canvas}
            nestedScrollEnabled
            onOK={handleSignature}
            onEmpty={handleEmpty}
            onClear={handleClear}
            onError={handleError}
            autoClear={false}
            webStyle={WEB_STYLE_HIDE_FOOTER}
            penColor={penColor}
            minWidth={minWidth}
            maxWidth={maxWidth}
            backgroundColor="rgba(0,0,0,0)"
            imageType="image/png"
            trimWhitespace
            onBegin={() => setShowActionButtons(true)}
            webviewProps={{
              cacheEnabled: true,
              androidLayerType: 'hardware',
            }}
          />

          {showActionButtons && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.clearBtn]}
                onPress={handlePressClear}
                accessibilityRole="button"
                accessibilityLabel="Borrar firma"
              >
                <Text style={styles.clearBtnText}>Borrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.acceptBtn, isLoading && styles.acceptBtnDisabled]}
                onPress={handlePressAccept}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel="Aceptar firma"
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.acceptBtnText}>Aceptar firma</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const CANVAS_HEIGHT = 220;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    marginTop: 16,
    marginBottom: 6,
  },
  hint: {
    fontSize: 13,
    color: '#94a3b8',
  },
  preview: {
    width: '100%',
    maxWidth: 335,
    minHeight: 80,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  canvas: {
    width: '100%',
    height: CANVAS_HEIGHT,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  previewImage: {
    width: 335,
    height: 114,
    backgroundColor: 'transparent',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    width: '100%',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  clearBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  clearBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  acceptBtn: {
    backgroundColor: '#1e40af',
  },
  acceptBtnDisabled: {
    opacity: 0.85,
  },
  acceptBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  signAgainBtn: {
    marginTop: 12,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1e40af',
  },
  signAgainBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
  },
});

export default SignatureScreen;