import Image from "next/image";

const assetVersion = "20260525-assets-refresh-2";

export default function FloralCorners() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden="true">
      <Image
        className="floral-corner floral-corner-top"
        src={`/images/floral-top.png?v=${assetVersion}`}
        alt=""
        width={640}
        height={520}
        priority
      />
      <Image
        className="floral-corner floral-corner-bottom"
        src={`/images/floral-bottom.png?v=${assetVersion}`}
        alt=""
        width={560}
        height={660}
        priority
      />
      <Image
        className="floral-corner floral-corner-bottom-right"
        src={`/images/floral-bottom-right.png?v=${assetVersion}`}
        alt=""
        width={440}
        height={660}
        priority
      />
    </div>
  );
}
