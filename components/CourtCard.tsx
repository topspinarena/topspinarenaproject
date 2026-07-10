type Slot = {
  time: string;
  status: string;
};

type CourtCardProps = {
  name: string;
  color: string;
  schedule: Slot[];
};

export default function CourtCard({
  name,
  color,
  schedule,
}: CourtCardProps) {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-lime-400 transition">

      <h3 className="text-xl font-bold mb-5">
        {color} {name}
      </h3>

      {schedule.map((slot) => (

        <div
          key={slot.time}
          className="flex justify-between py-2 border-b border-slate-800"
        >

          <span>{slot.time}</span>

          <span
            className={
              slot.status === "Available"
                ? "text-green-400 font-semibold"
                : "text-red-400 font-semibold"
            }
          >
            {slot.status}
          </span>

        </div>

      ))}

      <button className="mt-6 w-full bg-lime-400 text-black font-bold py-3 rounded-xl hover:bg-lime-300 transition">
        Book Court
      </button>

    </div>
  );
}