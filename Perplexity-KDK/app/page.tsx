"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Calendar, Hospital, History, UserPlus } from "lucide-react"

export default function BloodDonationTracker() {
  const [selectedState, setSelectedState] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedTaluka, setSelectedTaluka] = useState("")
  const [districts, setDistricts] = useState<string[]>([])
  const [talukas, setTalukas] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [filteredDonors, setFilteredDonors] = useState<any[]>([])
  const [nearbyHospitals, setNearbyHospitals] = useState<any[]>([])

  // State and district data
  const stateDistrictData: Record<string, string[]> = {
    Maharashtra: [
      "Thane",
      "Pune",
      "Mumbai Suburban",
      "Nashik",
      "Nagpur",
      "Ahmadnagar",
      "Solapur",
      "Jalgaon",
      "Kolhapur",
      "Aurangabad",
      "Nanded",
      "Mumbai City",
      "Akola",
      "Latur",
      "Dhule",
      "Palghar",
      "Jalna",
      "Raigarh",
      "Parbhani",
      "Satara",
      "Bid",
      "Sangli",
      "Amravati",
      "Yavatmal",
      "Buldhana",
      "Beed",
      "Nandurbar",
      "Osmanabad",
      "Wardha",
      "Washim",
      "Hingoli",
      "Gondiya",
      "Chandrapur",
      "Gadchiroli",
      "Bhandara",
      "Sindhudurg",
      "Ratnagiri",
    ],
    Karnataka: [
      "Bangalore Urban",
      "Bangalore Rural",
      "Mysore",
      "Belgaum",
      "Gulbarga",
      "Raichur",
      "Bijapur",
      "Bagalkot",
      "Bellary",
      "Bidar",
      "Chamarajanagar",
      "Chikkaballapur",
      "Chikmagalur",
      "Chitradurga",
      "Dakshina Kannada",
      "Davanagere",
      "Dharwad",
      "Gadag",
      "Hassan",
      "Haveri",
      "Kodagu",
      "Kolar",
      "Koppal",
      "Mandya",
      "Ramanagara",
      "Shimoga",
      "Tumkur",
      "Udupi",
      "Uttara Kannada",
      "Yadgir",
    ],
    "Tamil Nadu": [
      "Chennai",
      "Coimbatore",
      "Cuddalore",
      "Dharmapuri",
      "Dindigul",
      "Erode",
      "Kanchipuram",
      "Kanyakumari",
      "Karur",
      "Krishnagiri",
      "Madurai",
      "Nagapattinam",
      "Namakkal",
      "Nilgiris",
      "Perambalur",
      "Pudukkottai",
      "Ramanathapuram",
      "Salem",
      "Sivaganga",
      "Thanjavur",
      "Theni",
      "Thoothukudi",
      "Tiruchirappalli",
      "Tirunelveli",
      "Tiruppur",
      "Tiruvallur",
      "Tiruvannamalai",
      "Tiruvarur",
      "Vellore",
      "Viluppuram",
      "Virudhunagar",
    ],
  }

  // Taluka data for selected districts
  const talukaData: Record<string, Record<string, string[]>> = {
    Maharashtra: {
      Thane: ["Thane", "Kalyan", "Murbad", "Bhiwandi", "Vasai", "Uran", "Shahapur", "Ambarnath"],
      Pune: ["Pune City", "Baramati", "Junnar", "Shirur", "Maval", "Daund", "Indapur", "Purandar"],
      "Mumbai Suburban": ["Andheri", "Borivali", "Kandivali", "Dahisar", "Goregaon", "Jogeshwari", "Juhu", "Malad"],
      "Mumbai City": ["Dadar", "Fort", "Girgaon", "Kalbadevi", "Parel", "Tardeo", "Byculla", "Charni Road"],
      Nashik: ["Nashik", "Niphad", "Dindori", "Malegaon", "Nashik City", "Sinnar", "Igatpuri", "Trimbak"],
    },
    Karnataka: {
      "Bangalore Urban": ["Bangalore North", "Bangalore South", "Bangalore East", "Bangalore West", "Anekal"],
      Mysore: ["Mysore", "Nanjangud", "T. Narasipura", "H.D. Kote", "Hunsur", "K.R. Nagar", "Periyapatna"],
      Belgaum: ["Belgaum", "Khanapur", "Bailhongal", "Saundatti", "Ramdurg", "Gokak", "Hukkeri"],
    },
    "Tamil Nadu": {
      Chennai: ["Chennai North", "Chennai South", "Chennai East", "Chennai West", "Chennai Central"],
      Coimbatore: ["Coimbatore North", "Coimbatore South", "Mettupalayam", "Pollachi", "Valparai", "Sulur"],
      Madurai: ["Madurai North", "Madurai South", "Madurai East", "Madurai West", "Melur", "Vadipatti"],
    },
  }

  // Sample data for hospitals in major cities
  const hospitalData: Record<string, any[]> = {
    Mumbai: [
      {
        name: "Lilavati Hospital",
        address: "A-791, Bandra Reclamation, Bandra West",
        contact: "022-26751000",
        bloodBanks: true,
      },
      {
        name: "Tata Memorial Hospital",
        address: "Dr. E Borges Road, Parel",
        contact: "022-24177000",
        bloodBanks: true,
      },
      {
        name: "Kokilaben Dhirubhai Ambani Hospital",
        address: "Four Bungalows, Andheri West",
        contact: "022-30999999",
        bloodBanks: true,
      },
    ],
    Bangalore: [
      { name: "Manipal Hospital", address: "98, HAL Airport Road", contact: "080-25024444", bloodBanks: true },
      {
        name: "Narayana Hrudayalaya",
        address: "258/A, Bommasandra Industrial Area",
        contact: "080-71222222",
        bloodBanks: true,
      },
      {
        name: "Columbia Asia Hospital",
        address: "26/4, Brigade Gateway, Yeshwanthpur",
        contact: "080-39898969",
        bloodBanks: true,
      },
    ],
    Chennai: [
      {
        name: "Apollo Hospitals",
        address: "21, Greams Lane, Off Greams Road",
        contact: "044-28290200",
        bloodBanks: true,
      },
      {
        name: "Stanley Medical College and Hospital",
        address: "Old Jail Road, Royapuram",
        contact: "044-25281347",
        bloodBanks: true,
      },
      {
        name: "Madras Medical College",
        address: "EVR Periyar Salai, Park Town",
        contact: "044-25305000",
        bloodBanks: true,
      },
    ],
  }

  // Blood donor data structure (sample)
  const bloodDonorSample = [
    {
      id: 1,
      name: "Rahul Sharma",
      bloodGroup: "O+",
      contact: "9876543210",
      location: {
        state: "Maharashtra",
        district: "Mumbai City",
        taluka: "Dadar",
      },
      lastDonation: "2023-10-15",
      available: true,
    },
    {
      id: 2,
      name: "Priya Patel",
      bloodGroup: "A+",
      contact: "8765432109",
      location: {
        state: "Maharashtra",
        district: "Mumbai Suburban",
        taluka: "Andheri",
      },
      lastDonation: "2023-09-20",
      available: true,
    },
    {
      id: 3,
      name: "Amit Kumar",
      bloodGroup: "B-",
      contact: "7654321098",
      location: {
        state: "Karnataka",
        district: "Bangalore Urban",
        taluka: "Bangalore South",
      },
      lastDonation: "2023-11-05",
      available: true,
    },
    {
      id: 4,
      name: "Sneha Reddy",
      bloodGroup: "AB+",
      contact: "8765432101",
      location: {
        state: "Tamil Nadu",
        district: "Chennai",
        taluka: "Chennai South",
      },
      lastDonation: "2023-12-10",
      available: true,
    },
    {
      id: 5,
      name: "Vikram Singh",
      bloodGroup: "O-",
      contact: "9876543211",
      location: {
        state: "Karnataka",
        district: "Mysore",
        taluka: "Mysore",
      },
      lastDonation: "2024-01-05",
      available: true,
    },
  ]

  useEffect(() => {
    if (selectedState) {
      setDistricts(stateDistrictData[selectedState] || [])
      setSelectedDistrict("")
      setTalukas([])
      setSelectedTaluka("")
    } else {
      setDistricts([])
      setSelectedDistrict("")
      setTalukas([])
      setSelectedTaluka("")
    }
  }, [selectedState])

  useEffect(() => {
    if (selectedState && selectedDistrict && talukaData[selectedState]) {
      setTalukas(talukaData[selectedState][selectedDistrict] || [])
      setSelectedTaluka("")
    } else {
      setTalukas([])
      setSelectedTaluka("")
    }
  }, [selectedDistrict, selectedState])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const bloodGroup = (document.getElementById("blood-group") as HTMLSelectElement).value

    // Filter donors based on search criteria
    const filtered = bloodDonorSample.filter((donor) => {
      return (
        (bloodGroup === "" || donor.bloodGroup === bloodGroup) &&
        (selectedState === "" || donor.location.state === selectedState) &&
        (selectedDistrict === "" || donor.location.district === selectedDistrict) &&
        (selectedTaluka === "" || donor.location.taluka === selectedTaluka) &&
        donor.available === true
      )
    })

    setFilteredDonors(filtered)

    // Find nearby hospitals
    let cityToShow = ""
    if (
      selectedState === "Maharashtra" &&
      (selectedDistrict === "Mumbai City" || selectedDistrict === "Mumbai Suburban")
    ) {
      cityToShow = "Mumbai"
    } else if (selectedState === "Karnataka" && selectedDistrict === "Bangalore Urban") {
      cityToShow = "Bangalore"
    } else if (selectedState === "Tamil Nadu" && selectedDistrict === "Chennai") {
      cityToShow = "Chennai"
    }

    setNearbyHospitals(hospitalData[cityToShow] || [])
    setShowResults(true)
  }

  const contactDonor = (donorId: number) => {
    const donor = bloodDonorSample.find((d) => d.id === donorId)
    if (donor) {
      alert(`Contacting ${donor.name} at ${donor.contact}`)
    }
  }

  const contactHospital = (contact: string) => {
    alert(`Calling hospital at ${contact}`)
  }

  const registerForCamp = (campId: number) => {
    alert(`Registration for camp ${campId} will be implemented in the next phase.`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-8 text-center">
        <h1 className="text-4xl font-bold tracking-wide">Rakanjali</h1>
        <p className="text-xl mt-2 opacity-90">Connecting Blood Donors with Hospitals in Emergencies</p>
      </header>

      <nav className="bg-blue-600 sticky top-0 z-10 shadow-md">
        <ul className="flex justify-center gap-8 max-w-6xl mx-auto py-4 px-4 flex-wrap">
          <li>
            <a
              href="#search"
              className="text-white font-medium px-4 py-2 rounded-md hover:bg-blue-500/20 flex items-center gap-1"
            >
              <Search size={18} /> Find Donors
            </a>
          </li>
          <li>
            <a
              href="#camps"
              className="text-white font-medium px-4 py-2 rounded-md hover:bg-blue-500/20 flex items-center gap-1"
            >
              <Calendar size={18} /> Donation Camps
            </a>
          </li>
          <li>
            <a
              href="#hospitals"
              className="text-white font-medium px-4 py-2 rounded-md hover:bg-blue-500/20 flex items-center gap-1"
            >
              <Hospital size={18} /> Hospitals
            </a>
          </li>
          <li>
            <a
              href="#history"
              className="text-white font-medium px-4 py-2 rounded-md hover:bg-blue-500/20 flex items-center gap-1"
            >
              <History size={18} /> My History
            </a>
          </li>
          <li>
            <a
              href="#register"
              className="text-white font-medium px-4 py-2 rounded-md hover:bg-blue-500/20 flex items-center gap-1"
            >
              <UserPlus size={18} /> Register as Donor
            </a>
          </li>
        </ul>
      </nav>

      <main className="max-w-6xl mx-auto my-8 px-4">
        {/* Statistics Section */}
        <section className="bg-white rounded-lg p-8 shadow-sm border border-slate-200 mb-8">
          <h2 className="text-blue-600 text-2xl font-semibold mb-6 pb-2 border-b-2 border-blue-200">
            Blood Donation Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <div className="bg-white rounded-lg p-6 text-center border border-slate-200 shadow-sm">
              <div className="text-4xl font-bold text-blue-500 mb-2">1,234</div>
              <p className="text-slate-600">Active Donors</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center border border-slate-200 shadow-sm">
              <div className="text-4xl font-bold text-blue-500 mb-2">56</div>
              <p className="text-slate-600">Available Today</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center border border-slate-200 shadow-sm">
              <div className="text-4xl font-bold text-blue-500 mb-2">789</div>
              <p className="text-slate-600">Lives Saved</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center border border-slate-200 shadow-sm">
              <div className="text-4xl font-bold text-blue-500 mb-2">12</div>
              <p className="text-slate-600">Upcoming Camps</p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section id="search" className="bg-white rounded-lg p-8 shadow-sm border border-slate-200 mb-8">
          <h2 className="text-blue-600 text-2xl font-semibold mb-6 pb-2 border-b-2 border-blue-200">
            Find a Blood Donor
          </h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="relative">
              <label htmlFor="blood-group" className="absolute -top-2 left-4 bg-white px-2 text-sm text-blue-600">
                Blood Group
              </label>
              <select
                id="blood-group"
                className="w-full p-3 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div className="relative">
              <label htmlFor="state" className="absolute -top-2 left-4 bg-white px-2 text-sm text-blue-600">
                State
              </label>
              <select
                id="state"
                className="w-full p-3 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">Select State</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
              </select>
            </div>
            <div className="relative">
              <label htmlFor="district" className="absolute -top-2 left-4 bg-white px-2 text-sm text-blue-600">
                District
              </label>
              <select
                id="district"
                className="w-full p-3 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedState}
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label htmlFor="taluka" className="absolute -top-2 left-4 bg-white px-2 text-sm text-blue-600">
                Taluka
              </label>
              <select
                id="taluka"
                className="w-full p-3 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={selectedTaluka}
                onChange={(e) => setSelectedTaluka(e.target.value)}
                disabled={!selectedDistrict || talukas.length === 0}
              >
                <option value="">Select Taluka</option>
                {talukas.map((taluka) => (
                  <option key={taluka} value={taluka}>
                    {taluka}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md uppercase tracking-wide"
              >
                Search Donors
              </button>
            </div>
          </form>
        </section>

        {/* Results Section */}
        {showResults && (
          <section id="results" className="bg-white rounded-lg p-8 shadow-sm border border-slate-200 mb-8">
            <h2 className="text-blue-600 text-2xl font-semibold mb-6 pb-2 border-b-2 border-blue-200">
              Search Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredDonors.length > 0 ? (
                filteredDonors.map((donor) => (
                  <div key={donor.id} className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm relative">
                    <span className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {donor.bloodGroup}
                    </span>
                    <h3 className="text-lg font-semibold mb-2">{donor.name}</h3>
                    <p className="text-slate-600 mb-1">
                      <strong>Location:</strong> {donor.location.taluka}, {donor.location.district},{" "}
                      {donor.location.state}
                    </p>
                    <p className="text-slate-600 mb-4">
                      <strong>Last Donation:</strong> {new Date(donor.lastDonation).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => contactDonor(donor.id)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                    >
                      Contact Donor
                    </button>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-slate-600">
                  No donors found matching your criteria. Please try with different search parameters.
                </p>
              )}
            </div>
          </section>
        )}

        {/* Nearby Camps Section */}
        <section id="camps" className="bg-white rounded-lg p-8 shadow-sm border border-slate-200 mb-8">
          <h2 className="text-blue-600 text-2xl font-semibold mb-6 pb-2 border-b-2 border-blue-200">
            Upcoming Blood Donation Camps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
              <img
                src="/placeholder.svg?height=200&width=350"
                alt="Blood Donation Camp"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <span className="inline-block bg-indigo-500 text-white px-3 py-1 rounded-full text-sm mb-4">
                  Mar 15, 2025
                </span>
                <h3 className="text-lg font-semibold mb-2">City Hospital Blood Drive</h3>
                <p className="text-slate-600 mb-4">
                  Join us for our monthly blood donation camp. Free health checkup included.
                </p>
                <button
                  onClick={() => registerForCamp(1)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                >
                  Register Now
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
              <img
                src="/placeholder.svg?height=200&width=350"
                alt="Blood Donation Camp"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <span className="inline-block bg-indigo-500 text-white px-3 py-1 rounded-full text-sm mb-4">
                  Mar 20, 2025
                </span>
                <h3 className="text-lg font-semibold mb-2">Community Center Drive</h3>
                <p className="text-slate-600 mb-4">Special blood donation drive organized by the local community.</p>
                <button
                  onClick={() => registerForCamp(2)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                >
                  Register Now
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
              <img
                src="/placeholder.svg?height=200&width=350"
                alt="Blood Donation Camp"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <span className="inline-block bg-indigo-500 text-white px-3 py-1 rounded-full text-sm mb-4">
                  Mar 25, 2025
                </span>
                <h3 className="text-lg font-semibold mb-2">Corporate Blood Drive</h3>
                <p className="text-slate-600 mb-4">
                  Blood donation camp at Tech Park. All donors receive certificates.
                </p>
                <button
                  onClick={() => registerForCamp(3)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                >
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* User History Section */}
        <section id="history" className="bg-white rounded-lg p-8 shadow-sm border border-slate-200 mb-8">
          <h2 className="text-blue-600 text-2xl font-semibold mb-6 pb-2 border-b-2 border-blue-200">
            My Donation History
          </h2>
          <div className="py-6">
            <div className="relative pl-8 pb-6 border-l-2 border-blue-500">
              <div className="absolute left-[-1rem] bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                15
              </div>
              <h3 className="text-lg font-semibold">Last Donation</h3>
              <p className="text-slate-600">January 15, 2025 at City Hospital</p>
              <p className="text-slate-600">Blood Group: O+</p>
            </div>
            <div className="relative pl-8 pb-6 border-l-2 border-blue-500">
              <div className="absolute left-[-1rem] bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                10
              </div>
              <h3 className="text-lg font-semibold">Previous Donation</h3>
              <p className="text-slate-600">October 10, 2024 at Community Center</p>
              <p className="text-slate-600">Blood Group: O+</p>
            </div>
            <div className="relative pl-8 pb-6 border-l-2 border-blue-500">
              <div className="absolute left-[-1rem] bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                5
              </div>
              <h3 className="text-lg font-semibold">First Donation</h3>
              <p className="text-slate-600">July 5, 2024 at Blood Bank</p>
              <p className="text-slate-600">Blood Group: O+</p>
            </div>
          </div>
        </section>

        {/* Hospitals Section */}
        <section id="hospitals" className="bg-white rounded-lg p-8 shadow-sm border border-slate-200 mb-8">
          <h2 className="text-blue-600 text-2xl font-semibold mb-6 pb-2 border-b-2 border-blue-200">
            Nearby Hospitals with Blood Banks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {nearbyHospitals.length > 0 ? (
              nearbyHospitals.map((hospital, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{hospital.name}</h3>
                    <p className="text-slate-600 mb-1">
                      <strong>Address:</strong> {hospital.address}
                    </p>
                    <p className="text-slate-600 mb-4">
                      <strong>Contact:</strong> {hospital.contact}
                    </p>
                    {hospital.bloodBanks && (
                      <span className="inline-block bg-indigo-500 text-white px-3 py-1 rounded-full text-sm mb-4">
                        Blood Bank Available
                      </span>
                    )}
                    <button
                      onClick={() => contactHospital(hospital.contact)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md mt-2"
                    >
                      Contact Hospital
                    </button>
                  </div>
                </div>
              ))
            ) : showResults ? (
              <p className="col-span-full text-slate-600">
                No hospital information available for the selected location.
              </p>
            ) : (
              <>
                <div className="bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Lilavati Hospital</h3>
                    <p className="text-slate-600 mb-1">
                      <strong>Address:</strong> A-791, Bandra Reclamation, Bandra West
                    </p>
                    <p className="text-slate-600 mb-4">
                      <strong>Contact:</strong> 022-26751000
                    </p>
                    <span className="inline-block bg-indigo-500 text-white px-3 py-1 rounded-full text-sm mb-4">
                      Blood Bank Available
                    </span>
                    <button
                      onClick={() => contactHospital("022-26751000")}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md mt-2"
                    >
                      Contact Hospital
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Tata Memorial Hospital</h3>
                    <p className="text-slate-600 mb-1">
                      <strong>Address:</strong> Dr. E Borges Road, Parel
                    </p>
                    <p className="text-slate-600 mb-4">
                      <strong>Contact:</strong> 022-24177000
                    </p>
                    <span className="inline-block bg-indigo-500 text-white px-3 py-1 rounded-full text-sm mb-4">
                      Blood Bank Available
                    </span>
                    <button
                      onClick={() => contactHospital("022-24177000")}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md mt-2"
                    >
                      Contact Hospital
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Apollo Hospitals</h3>
                    <p className="text-slate-600 mb-1">
                      <strong>Address:</strong> 21, Greams Lane, Off Greams Road
                    </p>
                    <p className="text-slate-600 mb-4">
                      <strong>Contact:</strong> 044-28290200
                    </p>
                    <span className="inline-block bg-indigo-500 text-white px-3 py-1 rounded-full text-sm mb-4">
                      Blood Bank Available
                    </span>
                    <button
                      onClick={() => contactHospital("044-28290200")}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md mt-2"
                    >
                      Contact Hospital
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-blue-600 text-white text-center py-6 mt-8">
        <p>© 2025 Rakanjali. All Rights Reserved.</p>
        <p className="mt-2">
          Contact:{" "}
          <a href="mailto:info@rakanjali.org" className="underline">
            info@rakanjali.org
          </a>{" "}
          | Phone: +91 1234567890
        </p>
      </footer>
    </div>
  )
}

