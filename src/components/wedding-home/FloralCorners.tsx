import Image from "next/image";

export default function FloralCorners() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden="true">
      <Image
        className="floral-corner floral-corner-top"
        src="/images/floral-top.png"
        alt=""
        width={640}
        height={520}
        priority
      />
      <Image
        className="floral-corner floral-corner-bottom"
        src="/images/floral-bottom.png"
        alt=""
        width={560}
        height={660}
        priority
      />
    </div>
  );
}
