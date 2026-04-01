export interface UDSRecord {
  awb_number: string;
  client_name: string;
  client_category: string;
  payment_mode: string;
  product_name: string;
  client_promised_date: string;
  shadowfax_promised_date: string;
  ticket_id: string;
  ist_ticket_creation_datetime: string;
  ist_ticket_created_date: string;
  tag: string;
  ticket_source: string;
  ticket_reason: string;
  customer_comments_against_ticket_raised: string;
  ticket_status: string;
  shipment_status_at_runsheet_closure_prior_to_ticket_creation: string;
  shipment_status_at_the_runsheet_closure_on_ticket_creation_date: string;
  shipment_status_during_ticket_creation: string;
  ist_of_status_marking_before_ticket_creation: string;
  hour_of_status_marking_before_ticket_creation: string;
  rider_app_version_during_the_last_status_marked: string;
  current_order_status: string;
  pu_count_of_uds_awb: string;
  ticket_repeat_count: string;
  rider_id_of_last_runsheet_before_ticket_creation: string;
  rider_name: string;
  rider_dsr: string;
  total_order_assigned_to_rider: string;
  runsheet_dsr: string;
  last_runsheet_date_before_ticket_creation: string;
  hub_name: string;
  pod: string;
  order_type: string;
  reseller_name: string;
  category_of_last_call_before_ticket_creation: string;
  hangup_details_of_call_before_ticket_creation: string;
  category_of_last_call_riderapp_logs_based: string;
  summarized_category_of_call: string;
  total_number_of_proper_call_attempt: string;
  total_number_of_improper_call_attempt: string;
  total_number_of_answered_calls: string;
  total_number_of_calls_made: string;
  last_rider_app_call_initiation_time: string;
  last_rider_app_call_end_time: string;
  ist_last_call_start_time: string;
  hub_masking_input_remarks_on_same_date_of_runsheet: string;
  Hub_Masking_Call_Category: string;
  bad_scan_flag_of_last_attempt_before_ticket_created: string;
  shipment_manifest_reached_the_hub_before_ticket_created: string;
  non_del_customer_geo_location_flag_of_last_attempt_before_ticket_created: string;
  del_customer_geo_location_flag_of_last_attempt_before_ticket_created: string;
  x_seal_flag: string;
  [key: string]: string;
}

export interface FilterState {
  client_name: string;
  client_category: string;
  payment_mode: string;
  ticket_status: string;
  ticket_reason: string;
  hub_name: string;
  current_order_status: string;
  tag: string;
  ticket_source: string;
  order_type: string;
}

export const EMPTY_FILTERS: FilterState = {
  client_name: "",
  client_category: "",
  payment_mode: "",
  ticket_status: "",
  ticket_reason: "",
  hub_name: "",
  current_order_status: "",
  tag: "",
  ticket_source: "",
  order_type: "",
};

export function getUniqueValues(data: UDSRecord[], field: keyof UDSRecord): string[] {
  const vals = new Set<string>();
  data.forEach((r) => {
    if (r[field] && r[field].toString().trim()) vals.add(r[field].toString().trim());
  });
  return Array.from(vals).sort();
}

export function applyFilters(data: UDSRecord[], filters: FilterState): UDSRecord[] {
  return data.filter((row) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return row[key]?.toString().trim() === value;
    });
  });
}

export function countBy(data: UDSRecord[], field: keyof UDSRecord): { name: string; value: number }[] {
  const counts: Record<string, number> = {};
  data.forEach((r) => {
    const val = r[field]?.toString().trim() || "Unknown";
    counts[val] = (counts[val] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getInsights(data: UDSRecord[], filtered: UDSRecord[], hasFilter: boolean): string[] {
  const insights: string[] = [];
  if (filtered.length === 0) return ["No data matches current filters."];

  // Ticket status breakdown
  const statusCounts = countBy(filtered, "ticket_status");
  if (statusCounts.length > 0) {
    const top = statusCounts[0];
    const pct = ((top.value / filtered.length) * 100).toFixed(1);
    insights.push(`${pct}% of tickets are in "${top.name}" status (${top.value} of ${filtered.length})`);
  }

  // Top ticket reason
  const reasons = countBy(filtered, "ticket_reason");
  if (reasons.length > 0) {
    insights.push(`Top ticket reason: "${reasons[0].name}" accounts for ${((reasons[0].value / filtered.length) * 100).toFixed(1)}% of cases`);
  }

  // Payment mode
  const payments = countBy(filtered, "payment_mode");
  const codTickets = payments.find((p) => p.name.toLowerCase().includes("cod"));
  if (codTickets) {
    insights.push(`COD shipments make up ${((codTickets.value / filtered.length) * 100).toFixed(1)}% of UDS tickets — higher cash risk`);
  }

  // Bad scan flag
  const badScans = filtered.filter((r) => r.bad_scan_flag_of_last_attempt_before_ticket_created?.toString().toLowerCase() === "yes" || r.bad_scan_flag_of_last_attempt_before_ticket_created === "1").length;
  if (badScans > 0) {
    insights.push(`${badScans} shipments (${((badScans / filtered.length) * 100).toFixed(1)}%) had bad scan flags before ticket creation`);
  }

  // Geo location flag
  const geoIssues = filtered.filter((r) => r.non_del_customer_geo_location_flag_of_last_attempt_before_ticket_created?.toString().toLowerCase() === "yes" || r.non_del_customer_geo_location_flag_of_last_attempt_before_ticket_created === "1").length;
  if (geoIssues > 0) {
    insights.push(`${geoIssues} tickets (${((geoIssues / filtered.length) * 100).toFixed(1)}%) had non-deliverable customer geo-location issues`);
  }

  // Repeat tickets
  const repeatTickets = filtered.filter((r) => parseInt(r.ticket_repeat_count || "0") > 1).length;
  if (repeatTickets > 0) {
    insights.push(`${repeatTickets} AWBs have repeat tickets (>1 ticket) — possible persistent delivery issues`);
  }

  // Top hub
  const hubs = countBy(filtered, "hub_name");
  if (hubs.length > 0 && hubs[0].name !== "Unknown") {
    insights.push(`Hub "${hubs[0].name}" has the most UDS tickets: ${hubs[0].value}`);
  }

  // Call attempts
  const noCallAttempts = filtered.filter((r) => parseInt(r.total_number_of_calls_made || "0") === 0).length;
  if (noCallAttempts > 0) {
    insights.push(`${noCallAttempts} shipments (${((noCallAttempts / filtered.length) * 100).toFixed(1)}%) had zero call attempts made to customer`);
  }

  // X-seal flag
  const xSeal = filtered.filter((r) => r.x_seal_flag?.toString().toLowerCase() === "yes" || r.x_seal_flag === "1").length;
  if (xSeal > 0) {
    insights.push(`${xSeal} shipments carry x-seal flags — check for tamper/damage risks`);
  }

  return insights.slice(0, 7);
}
