import {contact} from '../src/contact.js';
const shots = [
  [
    'Exterior and arrival',
    'Show how the property meets the street or approach.',
    [
      'A clear front view with the entrance visible',
      'A second angle showing the home’s setting',
      'The driveway or approach, when relevant'
    ]
  ],
  [
    'Living spaces',
    'Help buyers understand the layout and connections.',
    [
      'A balanced view of the main living area',
      'A second angle showing adjoining spaces',
      'A detail that accurately shows a distinctive feature'
    ]
  ],
  [
    'Kitchen and dining',
    'Give the room context before focusing on details.',
    [
      'The full kitchen with counters and layout visible',
      'The dining area and connection to the kitchen',
      'An additional angle for features not visible in the first image'
    ]
  ],
  [
    'Bedrooms and bathrooms',
    'Show the space clearly and keep the sequence easy to follow.',
    [
      'A full view of the primary bedroom',
      'Other bedrooms in a consistent order',
      'Bathrooms with fixtures and room layout visible'
    ]
  ],
  [
    'Outdoor areas and additional spaces',
    'Include the features that help explain this property.',
    [
      'Yard, patio, deck, or other outdoor areas',
      'Garage, workshop, or additional rooms, if applicable',
      'Views photographed from the property’s actual location'
    ]
  ],
  [
    'Land and acreage',
    'For land listings, discuss what imagery best explains the site.',
    [
      'The entrance and visible access route',
      'A wider view of the terrain and current condition',
      'Distinctive site features with their location explained'
    ]
  ]
];
export function photoGuide() {
  return `<section class="photo-guide" aria-labelledby="photo-guide-heading"><div class="photo-guide-intro"><div><p class="eyebrow">Before the camera comes out</p><h2 id="photo-guide-heading">A clear picture starts with a little preparation.</h2><p>Use this guide to plan the images with Brad or your photographer. Choose the views that apply to your property; you do not need every shot below.</p></div><button type="button" data-print-guide hidden>Print This Guide</button></div><nav class="page-sections" aria-label="Photography guide sections"><a href="#photo-preparation">Prepare</a><a href="#photo-shot-list">Plan the views</a><a href="#photo-handoff">Hand off the images</a></nav><section id="photo-preparation" class="photo-preparation"><h2>Prepare the rooms and the route.</h2><ul><li>Clear everyday clutter and move personal documents out of view.</li><li>Discuss which spaces and features should be included before the session.</li><li>Plan light and timing with the photographer. Keep room lighting consistent.</li><li>Arrange safe access to the spaces being photographed; share access details directly with Brad.</li></ul></section><section id="photo-shot-list"><p class="eyebrow">A starting shot list</p><h2>Move from the setting to the details.</h2><div class="photo-shot-grid">${shots.map(([title, description, items], i) => `<article><span class="worksheet-number">0${i + 1}</span><h3>${title}</h3><p>${description}</p><ul>${items.map(item => `<li>${item}</li>`).join('')}</ul></article>`).join('')}</div></section><aside class="photo-accuracy"><h2>Keep the presentation true to the property.</h2><p>Use current photos of the actual property. Discuss any editing or virtual staging and the required labeling with Brad. A photo should help explain the property’s condition and features. For land, discuss how boundaries, access, and site information will be verified before adding overlays or captions.</p></aside><section id="photo-handoff" class="photo-handoff"><p class="eyebrow">Ready for the property page</p><h2>Give Brad an organized image set.</h2><ol><li><strong>Keep the originals.</strong> Send the authorized files through the method agreed with Brad. Include who created them and permission to use them.</li><li><strong>Choose a cover and an order.</strong> Start with the property’s strongest accurate overview, then arrange images in a logical walk through the spaces.</li><li><strong>Add short descriptions.</strong> Identify the room, feature, or view in each image. Tell Brad which details need confirmation.</li><li><strong>Review the website copies.</strong> Review the cover image, room order and captions with Brad before the listing goes live. Make sure the photos represent the property accurately.</li></ol><p>Photography services, editing, drone imagery, scheduling, and costs should be agreed with Brad for your listing.</p></section><div class="photo-guide-next"><a class="button" href="/sell/#inquiry">Discuss My Listing Photos</a><a href="/seller-checklist/">Open the Seller Checklist →</a><a href="/listing-marketing/">Back to the Listing Approach →</a></div><p class="photo-print-contact">Brad Hazen · Realty Pro, Inc. · ${contact.phone} · ${contact.email}</p></section>`;
}
