import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, DollarSign } from 'lucide-react';
import jsPDF from 'jspdf';

const ConstructionPlanner = () => {
  const [schoolName, setSchoolName] = useState('');
  const [constructionType, setConstructionType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [estimates, setEstimates] = useState({
    "60CD": { gsf: 0, costs: {} },
    "100CD": { gsf: 0, costs: {} },
    "BidData": { gsf: 0, costs: {} }
  });

  const [tasks, setTasks] = useState([]);

  const categories = {
    "General Requirements": {
      "Υ.01": "Ισοπεδώσεις-Διαμορφώσεις",
      "Υ.02": "Σύνδεση με δίκτυο ΔΕΗ",
      "Υ.03": "Σύνδεση με δίκτυο ΟΤΕ",
      "Υ.04": "Σύνδεση με δίκτυο ύδρευσης",
      "Υ.05": "Σύνδεση με δίκτυο αποχέτευσης",
      "Υ.06": "Κατασκευή βόθρου",
      "Υ.07": "Κατασκευή δεξαμενής συλλογής βρόχινου νερού"
    },
    "Earthwork and Foundations": {
      "01.01": "Γενικές εκσκαφές γαιώδεις",
      "01.02": "Γενικές εκσκαφές ημιβραχώδης",
      "01.03": "Γενικές εκσκαφές βραχώδεις",
      "01.04": "Επιχώσεις με προϊόντα εκσκαφής",
      "01.05": "Ειδικές επιχώσεις με χαλίκι"
    },
    "Structural Works": {
      "ΠΧ.07": "Οπλισμένο σκυρόδεμα C12/15 (Ορεινές περιοχές)",
      "ΠΧ.08": "Οπλισμένο σκυρόδεμα C12/15 (Προσβάσιμες περιοχές)",
      "ΠΧ.09": "Οπλισμένο σκυρόδεμα C16/20 (Ορεινές περιοχές)",
      "ΠΧ.10": "Οπλισμένο σκυρόδεμα C16/20 (Προσβάσιμες περιοχές)"
    },
    "Utilities": {
      "Υ.08": "Έργα υποδομής - Ύδρευση",
      "ΠΧ.22": "Δίκτυο απορροής όμβριων υδάτων"
    },
    "Finishing Works": {
      "ΠΧ.04": "Αίθριος χώρος - Πλακοστρώσεις",
      "ΠΧ.05": "Χώρος πρασίνου - φυτεύσεις",
      "ΠΧ.06": "Υπαίθριος χώρος στάθμευσης",
      "ΠΧ.17": "Ξύλινη πέργκολα"
    }
  };

  const calculateTotals = (phase) => {
    let subtotal = 0;
    Object.values(categories).forEach(category => {
      Object.values(category).forEach(item => {
        subtotal += Number(estimates[phase].costs[item] || 0);
      });
    });
    return subtotal;
  };

  const handleCostChange = (phase, category, value) => {
    setEstimates(prev => ({
      ...prev,
      [phase]: {
        ...prev[phase],
        costs: {
          ...prev[phase].costs,
          [category]: Number(value) || 0
        }
      }
    }));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Construction Project Quote", 10, 10);

    doc.text(`School Name: ${schoolName}`, 10, 20);
    doc.text(`Construction Type: ${constructionType}`, 10, 30);
    doc.text(`Start Date: ${startDate}`, 10, 40);

    let yPosition = 50;

    Object.entries(categories).forEach(([groupName, items]) => {
      doc.text(groupName, 10, yPosition);
      yPosition += 10;
      Object.entries(items).forEach(([code, description]) => {
        doc.text(`${description}: ${estimates["60CD"].costs[description] || 0}`, 20, yPosition);
        yPosition += 10;
      });
    });

    doc.text(`Total Estimate: ${calculateTotals("60CD")}`, 10, yPosition + 10);

    doc.save("Construction_Quote.pdf");
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Construction Project Planner</CardTitle>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <Input 
              placeholder="Enter School Name"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
            />
            <Input
              placeholder="Enter Construction Type"
              value={constructionType}
              onChange={(e) => setConstructionType(e.target.value)}
            />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="costs">
        <TabsList>
          <TabsTrigger value="costs" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Cost Estimation
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Project Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="costs">
          <Card>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2">Description</th>
                      <th className="border p-2">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(categories).map(([groupName, items]) => (
                      <React.Fragment key={groupName}>
                        <tr className="bg-gray-100">
                          <td colSpan={2} className="border p-2 font-bold">{groupName}</td>
                        </tr>
                        {Object.entries(items).map(([code, description]) => (
                          <tr key={code}>
                            <td className="border p-2">{description}</td>
                            <td className="border p-2">
                              <Input
                                type="number"
                                value={estimates["60CD"].costs[description] || ''}
                                onChange={(e) => handleCostChange("60CD", description, e.target.value)}
                              />
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              <button 
                onClick={generatePDF}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                Generate Quote PDF
              </button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConstructionPlanner;